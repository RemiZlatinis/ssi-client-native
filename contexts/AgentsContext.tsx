import React, { createContext, useContext, useEffect, useState } from "react";
import EventSource from "react-native-sse";

import useAuth from "@/auth/useAuth";
import config from "@/config";
import {
  Agent,
  AgentSSE,
  KNOWN_AGENT_SSE_TYPES,
  MessageSSE,
  Service,
  ServiceSSE,
} from "@/types";
import { useNetwork } from "@/hooks";

interface AgentsContextType {
  agents: Agent[];
  loading: boolean;
  isConnected: boolean;
  refreshAgents: () => void;
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
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [refreshToggle, setRefreshToggle] = useState(false);
  const { isInternetReachable } = useNetwork();

  const { auth } = useAuth();

  const refreshAgents = () => {
    setRefreshToggle((prev) => !prev);
  };

  useEffect(() => {
    if (!auth) {
      setAgents([]);
      setLoading(false);
      setIsConnected(false);
      return;
    }

    setLoading(true);
    const es = new EventSource(
      config.BACKEND.BASE_URL + config.BACKEND.AGENTS_SSE,
      { headers: { Authorization: `Bearer ${auth.access}` } },
    );

    es.addEventListener("open", (event) => {
      setIsConnected(true);
    });

    es.addEventListener("message", (event) => {
      try {
        if (!event.data)
          return console.warn("SSE message event data is null or empty.");

        const payload: unknown = JSON.parse(event.data);

        if (
          !payload ||
          typeof payload !== "object" ||
          !("type" in payload) ||
          typeof payload.type !== "string" ||
          !(KNOWN_AGENT_SSE_TYPES as readonly string[]).includes(payload.type)
        ) {
          console.warn("Unknown SSE event:", event.data);
          return;
        }

        const data = payload as MessageSSE;

        switch (data.type) {
          case "initial_status":
            // data -> array of agents
            setAgents(mapAgents(data.agents)); // Map the agents objects and initialize the state
            setLoading(false); // Stop the initial loading
            break;

          case "agent_status_update":
            // data -> updated agent
            // If this is an uninitialized agent
            setAgents((prevAgents) => {
              if (!prevAgents.some((agent) => agent.id === data.agent_id)) {
                console.warn(
                  `Update for an uninitialized agent ${data.agent_id}-${data.agent_name} received:`,
                );
                // Do we add the agent or what? (-.-)
                // [...prevAgents, data.agent];
                return prevAgents; // Or ignore it
              }
              return prevAgents.map((agent) =>
                agent.id === data.agent_id
                  ? { ...agent, is_online: data.is_online } // Find it and update its dynamical fields
                  : agent,
              );
            });
            break;

          case "service_status_update":
            // data -> updated service
            setAgents((prevAgents) =>
              prevAgents.map((agent) =>
                agent.id === data.agent_id // Find the agent of the service
                  ? {
                      ...agent,
                      services: agent.services.map((service) =>
                        service.id === data.service_id // Find the service
                          ? {
                              ...service, // And update its dynamic fields
                              last_status: data.status,
                              last_message: data.message,
                              last_seen: dateStringToDate(data.timestamp),
                            }
                          : service,
                      ),
                    }
                  : agent,
              ),
            );
            break;

          case "service_removed":
            // data -> removed service
            setAgents((prevAgents) =>
              prevAgents.map((agent) =>
                agent.id === data.agent_id // Find the agent of the service
                  ? {
                      ...agent,
                      services: agent.services.filter(
                        (service) => service.id !== data.service_id, // and remove it
                      ),
                    }
                  : agent,
              ),
            );
            break;

          case "service_added":
            // data -> added service
            const mappedService = mapService(data);
            setAgents((prevAgents) =>
              prevAgents.map((agent) =>
                agent.id === data.agent_id // Find the agent of the service
                  ? {
                      ...agent,
                      services: [...agent.services, mappedService], // and add it
                    }
                  : agent,
              ),
            );
            break;

          default:
            console.warn("Unknown SSE event type:", data);
        }
      } catch (error) {
        console.error("Error parsing SSE message:", error, event.data);
        setLoading(false);
      }
    });

    es.addEventListener("error", (error) => {
      if ("message" in error && error.message === "Connection reset")
        console.log("SSE Error:", error);
      else console.error("SSE Error:", error);
      setLoading(false);
      setIsConnected(false);
    });

    es.addEventListener("close", (event) => {
      setLoading(false);
      setIsConnected(false);
    });

    return () => {
      es.close();
    };
  }, [auth, isInternetReachable, refreshToggle]);

  return (
    <AgentsContext.Provider
      value={{ agents, loading, isConnected, refreshAgents }}
    >
      {children}
    </AgentsContext.Provider>
  );
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Maps raw AgentSSE data from the server to Agent objects for the frontend
 * Transforms server field names to frontend field names and processes nested services
 *
 * @param agents - Array of raw agent data from SSE
 * @returns Array of processed Agent objects for frontend use
 */
function mapAgents(agents: AgentSSE[]): Agent[] {
  return agents.map((agent) => ({
    id: agent.agent_id,
    name: agent.agent_name,
    is_online: agent.is_online,
    ip_address: agent.ip_address,
    services: agent.services.map((service) => mapService(service)),
  }));
}

/**
 * Maps raw ServiceSSE data from the server to Service objects for the frontend
 * Transforms server field names to frontend field names and processes dates
 *
 * @param service - Raw service data from SSE
 * @returns Processed Service object for frontend use
 */
function mapService(service: ServiceSSE): Service {
  return {
    id: service.service_id,
    name: service.name,
    description: service.description,
    version: service.version,
    schedule: service.schedule,
    last_status: service.last_status,
    last_message: service.last_message,
    last_seen: dateStringToDate(service.last_seen),
  };
}

/**
 * Safely converts ISO date string to Date object
 * Handles null values and invalid date strings gracefully
 *
 * @param dateString - ISO 8601 date string or null
 * @returns Date object or null if invalid/empty
 */
function dateStringToDate(dateString: string | null): Date | null {
  if (dateString === null) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}
