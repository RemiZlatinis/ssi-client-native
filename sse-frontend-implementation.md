## Frontend Implementation Plan (Expo SDK 54)

This plan outlines the steps to integrate the real-time agent and service status updates from your Django backend's SSE endpoint into an Expo SDK 54 (React Native) application.

### 1. Core Technologies & Libraries

*   **Expo SDK 54 (React Native):** The application framework.
*   **React Navigation:** For screen navigation.
*   **`react-native-event-source`:** A polyfill for `EventSource` in React Native, necessary for SSE.
*   **`expo-secure-store`:** For securely storing authentication tokens.
*   **State Management:** (Choose one) React Context API, Redux Toolkit, Zustand, or similar. For this plan, we'll assume a Context API approach for simplicity, but it's adaptable.
*   **`axios` or `fetch`:** For standard API calls (e.g., login).

### 2. Data Structures

Define TypeScript interfaces (or simply object shapes) for clarity:

```typescript
// interfaces.ts
interface Service {
  service_id: string;
  name: string;
  status: string;
  message: string;
  last_seen: string | null; // ISO 8601 string
}

interface Agent {
  agent_id: string;
  agent_name: string;
  is_online: boolean;
  services: Service[];
}

// State will be a dictionary for easy lookup by agent_id
type AgentStatusState = {
  [agent_id: string]: Agent;
};
```

### 3. Implementation Steps

#### Step 1: Authentication Setup

1.  **Login/Registration Screens:** Implement UI and logic for user authentication.
2.  **Token Storage:**
    *   Upon successful login, store the received JWT token (e.g., `access_token`) securely using `expo-secure-store`.
    *   Example: `await SecureStore.setItemAsync('jwt_token', token);`
3.  **Authentication Context:**
    *   Create a `AuthContext` to manage the user's authentication state and provide the JWT token to other components.
    *   This context will be crucial for passing the token to the SSE connection.

#### Step 2: SSE Client Integration (`useAgentStatusStream` Hook)

Create a custom React hook (`useAgentStatusStream.ts`) to manage the SSE connection.

1.  **Install `react-native-event-source`:**
    ```bash
npm install react-native-event-source
# or
yarn add react-native-event-source
    ```
2.  **Hook Structure:**
    ```typescript
// hooks/useAgentStatusStream.ts
import { useEffect, useRef } from 'react';
import { EventSource } from 'react-native-event-source';
import { useAgentStatus } from '../context/AgentStatusContext'; // Assuming this context exists
import { API_BASE_URL } from '../config'; // Your backend URL

export const useAgentStatusStream = (authToken: string | null) => {
  const { dispatch } = useAgentStatus(); // Or your state management's dispatch
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!authToken) {
      console.log('No auth token, skipping SSE connection.');
      eventSourceRef.current?.close();
      return;
    }

    const sseUrl = `${API_BASE_URL}/sse_agent_status`;
    const headers = {
      Authorization: `Bearer ${authToken}`,
      'Cache-Control': 'no-cache', // Important for SSE
    };

    eventSourceRef.current = new EventSource(sseUrl, { headers });

    eventSourceRef.current.addEventListener('open', () => {
      console.log('SSE connection opened.');
    });

    eventSourceRef.current.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('SSE message:', data);

        switch (data.type) {
          case 'initial_status':
            dispatch({ type: 'SET_INITIAL_STATUS', payload: data.agents });
            break;
          case 'agent_status_update':
            dispatch({ type: 'UPDATE_AGENT_STATUS', payload: data });
            break;
          case 'service_status_update':
            dispatch({ type: 'UPDATE_SERVICE_STATUS', payload: data });
            break;
          default:
            console.warn('Unknown SSE event type:', data.type);
        }
      } catch (error) {
        console.error('Error parsing SSE message:', error, event.data);
      }
    });

    eventSourceRef.current.addEventListener('error', (error) => {
      console.error('SSE error:', error);
      // Implement reconnection logic here (e.g., exponential backoff)
      // For simplicity, we'll just close and let useEffect re-run if token changes
      eventSourceRef.current?.close();
    });

    return () => {
      console.log('Closing SSE connection.');
      eventSourceRef.current?.close();
    };
  }, [authToken, dispatch]); // Reconnect if token changes
};
    ```

#### Step 3: Global State Management (`AgentStatusContext`)

Create a React Context to hold and update the agent and service status.

1.  **Context Definition:**
    ```typescript
// context/AgentStatusContext.tsx
import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { Agent, AgentStatusState, Service } from '../interfaces';

type Action =
  | { type: 'SET_INITIAL_STATUS'; payload: Agent[] }
  | { type: 'UPDATE_AGENT_STATUS'; payload: { agent_id: string; is_online: boolean } }
  | { type: 'UPDATE_SERVICE_STATUS'; payload: { agent_id: string; service_id: string; status: string; message: string; timestamp: string } };

const agentStatusReducer = (state: AgentStatusState, action: Action): AgentStatusState => {
  switch (action.type) {
    case 'SET_INITIAL_STATUS':
      return action.payload.reduce((acc, agent) => {
        acc[agent.agent_id] = agent;
        return acc;
      }, {} as AgentStatusState);
    case 'UPDATE_AGENT_STATUS':
      if (state[action.payload.agent_id]) {
        return {
          ...state,
          [action.payload.agent_id]: {
            ...state[action.payload.agent_id],
            is_online: action.payload.is_online,
          },
        };
      }
      return state;
    case 'UPDATE_SERVICE_STATUS':
      if (state[action.payload.agent_id]) {
        const updatedAgent = { ...state[action.payload.agent_id] };
        const serviceIndex = updatedAgent.services.findIndex(
          (s) => s.service_id === action.payload.service_id
        );
        if (serviceIndex !== -1) {
          updatedAgent.services[serviceIndex] = {
            ...updatedAgent.services[serviceIndex],
            status: action.payload.status,
            message: action.payload.message,
            last_seen: action.payload.timestamp,
          };
          return { ...state, [action.payload.agent_id]: updatedAgent };
        }
      }
      return state;
    default:
      return state;
  }
};

const AgentStatusContext = createContext<{
  state: AgentStatusState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

export const AgentStatusProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(agentStatusReducer, {});
  return (
    <AgentStatusContext.Provider value={{ state, dispatch }}>
      {children}
    </AgentStatusContext.Provider>
  );
};

export const useAgentStatus = () => {
  const context = useContext(AgentStatusContext);
  if (context === undefined) {
    throw new Error('useAgentStatus must be used within an AgentStatusProvider');
  }
  return context;
};
    ```
2.  **Wrap App:** Wrap your main application component with `AgentStatusProvider`.
    ```typescript
// App.tsx
import { AgentStatusProvider } from './context/AgentStatusContext';
import { AuthProvider } from './context/AuthContext'; // Assuming you have one

function App() {
  return (
    <AuthProvider>
      <AgentStatusProvider>
        {/* Your navigation and screens */}
        <RootNavigator />
      </AgentStatusProvider>
    </AuthProvider>
  );
}
    ```

#### Step 4: UI Components & Integration

1.  **Main Dashboard Screen:**
    *   Get the `authToken` from your `AuthContext`.
    *   Call `useAgentStatusStream(authToken)` to initiate the SSE connection.
    *   Get the `state` (agent statuses) from `useAgentStatus()`.
    *   Render a list of `AgentCard` components.

    ```typescript
// screens/DashboardScreen.tsx
import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext'; // Your AuthContext
import { useAgentStatus } from '../context/AgentStatusContext';
import { useAgentStatusStream } from '../hooks/useAgentStatusStream';
import AgentCard from '../components/AgentCard';

const DashboardScreen = () => {
  const { authToken } = useAuth(); // Get token from AuthContext
  useAgentStatusStream(authToken); // Start SSE stream
  const { state: agentStatuses } = useAgentStatus();

  const agentsArray = Object.values(agentStatuses);

  if (!authToken) {
    return <Text>Please log in.</Text>; // Or navigate to login
  }

  if (agentsArray.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading agents...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={agentsArray}
        keyExtractor={(item) => item.agent_id}
        renderItem={({ item }) => <AgentCard agent={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default DashboardScreen;
    ```

2.  **`AgentCard` Component:**
    *   Displays agent name, online status (e.g., a colored dot).
    *   Can expand to show a list of services.

    ```typescript
// components/AgentCard.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Agent } from '../interfaces';
import ServiceItem from './ServiceItem'; // Assuming this component exists

interface AgentCardProps {
  agent: Agent;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.header}>
        <View style={[styles.statusIndicator, { backgroundColor: agent.is_online ? 'green' : 'red' }]} />
        <Text style={styles.agentName}>{agent.agent_name}</Text>
        <Text>{agent.is_online ? 'Online' : 'Offline'}</Text>
      </TouchableOpacity>
      {expanded && (
        <View style={styles.servicesContainer}>
          {agent.services.length > 0 ? (
            agent.services.map((service) => (
              <ServiceItem key={service.service_id} service={service} />
            ))
          ) : (
            <Text style={styles.noServices}>No services reported.</Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  agentName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  servicesContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  noServices: {
    fontStyle: 'italic',
    color: '#666',
  },
});

export default AgentCard;
    ```

3.  **`ServiceItem` Component:**
    *   Displays service name, status, message, and last seen timestamp.

    ```typescript
// components/ServiceItem.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Service } from '../interfaces';

interface ServiceItemProps {
  service: Service;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ service }) => {
  const statusColor = service.status === 'running' ? 'green' : service.status === 'stopped' ? 'red' : 'orange';

  return (
    <View style={styles.serviceItem}>
      <Text style={styles.serviceName}>{service.name}</Text>
      <View style={styles.statusRow}>
        <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
        <Text style={styles.serviceStatus}>{service.status}</Text>
      </View>
      {service.message && <Text style={styles.serviceMessage}>{service.message}</Text>}
      {service.last_seen && (
        <Text style={styles.lastSeen}>Last seen: {new Date(service.last_seen).toLocaleString()}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  serviceItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    padding: 10,
    marginVertical: 5,
    borderLeftWidth: 3,
    borderLeftColor: '#ddd',
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  serviceStatus: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  serviceMessage: {
    fontSize: 12,
    color: '#555',
    marginBottom: 3,
  },
  lastSeen: {
    fontSize: 10,
    color: '#888',
    fontStyle: 'italic',
  },
});

export default ServiceItem;
    ```

### 4. Error Handling & UI Feedback

*   **Loading States:** Display `ActivityIndicator` while `initial_status` is being fetched.
*   **Error Messages:** Show user-friendly error messages if authentication fails, SSE connection fails, or if the channel layer is not configured (as indicated by the backend SSE endpoint).
*   **Reconnection Logic:** The `useAgentStatusStream` hook should ideally implement a robust reconnection strategy (e.g., exponential backoff) for `onerror` events.
*   **Visual Cues:** Use colors (green/red/orange) and icons to quickly convey agent and service statuses.

### 5. Configuration

*   Create a `config.ts` file to store your backend API base URL.
    ```typescript
// config.ts
export const API_BASE_URL = 'http://192.168.1.20:8000'; // Replace with your actual backend IP/domain
    ```

### 6. Testing

*   **Authentication:** Verify login/logout and token storage.
*   **SSE Connection:**
    *   Test connecting and disconnecting agents from the backend.
    *   Verify `is_online` status updates in real-time on the frontend.
    *   Test service status updates.
    *   Simulate network disconnections to test reconnection logic.
*   **UI Responsiveness:** Ensure the UI updates smoothly without flickering.
*   **Security:** Confirm that only the authenticated user's agents are displayed and updated.

---