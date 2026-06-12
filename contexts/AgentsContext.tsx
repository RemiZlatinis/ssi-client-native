import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { AppState, AppStateStatus } from "react-native";
import EventSource from "react-native-sse";
import { Agent } from "@/types";
import api from "@/api";
import { useUser } from "./UserContext";
import { AgentsSSEEvent } from "@/api/apis/agents";

interface AgentsContextType {
  agents: Agent[];
  loading: boolean;
  isConnected: boolean;
  reconnect: () => void;
}

const AgentsContext = createContext<AgentsContextType | undefined>(undefined);

export const useAgents = (): AgentsContextType => {
  const context = useContext(AgentsContext);
  if (!context) {
    throw new Error("useAgents must be used within an AgentsProvider");
  }
  return context;
};

export const AgentsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useUser();

  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [resetConnectionToggle, setResetConnectionToggle] = useState(false);
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState,
  );

  const eventSourceRef = useRef<EventSource | null>(null);

  const reconnect = () => {
    setResetConnectionToggle((prev) => !prev);
  };

  const handleOpen = () => {
    setIsConnected(true);
    setLoading(false);
  };

  const handleError = (error: any) => {
    console.error("[AgentsContext] SSE Error:", error);
    setIsConnected(false);
    setLoading(false);
  };

  const handleClose = () => {
    setIsConnected(false);
  };

  const handleAgentsSSE = useCallback((event: AgentsSSEEvent) => {
    switch (event.type) {
      case "initial_status":
        setAgents(event.agents);
        break;

      case "status_update":
        setAgents((prevAgents) => {
          const exists = prevAgents.some(
            (agent) => agent.id === event.agent.id,
          );
          if (exists) {
            return prevAgents.map((agent) =>
              agent.id === event.agent.id ? event.agent : agent,
            );
          }
          return [...prevAgents, event.agent];
        });
        break;

      case "service_added":
        setAgents((prevAgents) =>
          prevAgents.map((agent) =>
            agent.id === event.agent_id
              ? {
                  ...agent,
                  services: [...agent.services, event.service],
                }
              : agent,
          ),
        );
        break;

      case "service_removed":
        setAgents((prevAgents) =>
          prevAgents.map((agent) =>
            agent.id === event.agent_id
              ? {
                  ...agent,
                  services: agent.services.filter(
                    (service) => service.id !== event.service_id,
                  ),
                }
              : agent,
          ),
        );
        break;

      case "service_status_update":
        setAgents((prevAgents) =>
          prevAgents.map((agent) =>
            agent.id === event.agent_id
              ? {
                  ...agent,
                  services: agent.services.map((service) =>
                    service.id === event.service_id
                      ? {
                          ...service,
                          last_status: event.status,
                          last_message: event.message,
                          last_seen: event.timestamp,
                        }
                      : service,
                  ),
                }
              : agent,
          ),
        );
        break;

      case "agent_removed":
        setAgents((prevAgents) =>
          prevAgents.filter((agent) => agent.id !== event.agent_id),
        );
        break;
    }
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      console.debug("[AgentsContext] AppState changed to:", nextAppState);
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!user || appState !== "active") {
      if (appState !== "active" && eventSourceRef.current) {
        console.debug(
          "[AgentsContext] App is in background, closing SSE connection",
        );
      }
      setAgents([]);
      setIsConnected(false);

      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      return;
    }

    let isMounted = true;
    setLoading(true);

    const setupConnection = async () => {
      // Close existing connection if any
      if (eventSourceRef.current) {
        console.debug("[AgentsContext] Closing existing SSE connection");
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      try {
        const es = await api.agents.agentsSSE(
          handleOpen,
          handleClose,
          handleError,
          handleAgentsSSE,
        );

        if (isMounted) {
          eventSourceRef.current = es;
        } else {
          es.close();
        }
      } catch (error) {
        if (isMounted) {
          console.error("[AgentsContext] Failed to setup SSE:", error);
          setLoading(false);
        }
      }
    };

    setupConnection();

    return () => {
      isMounted = false;
      if (eventSourceRef.current) {
        console.debug("[AgentsContext] Cleaning up SSE connection");
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [user, appState, resetConnectionToggle, handleAgentsSSE]);

  return (
    <AgentsContext.Provider value={{ agents, loading, isConnected, reconnect }}>
      {children}
    </AgentsContext.Provider>
  );
};
