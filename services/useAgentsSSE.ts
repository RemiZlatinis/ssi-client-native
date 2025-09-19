import { useEffect, useState } from "react";
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

function useAgentsSSE() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const { auth } = useAuth();

  useEffect(() => {
    if (!auth) return;

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

        // The 'data' from an SSE message is a string. We parse it into a plain object first for validation.
        const payload: unknown = JSON.parse(event.data);

        // Type guard to check if the payload is a valid message structure with a known type.
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

        // Cast as valid event
        const data = payload as MessageSSE;

        switch (data.type) {
          case "initial_status":
            setAgents(mapAgents(data.agents));
            setLoading(false);
            break;
          case "agent_status_update":
            setAgents((prevAgents) =>
              prevAgents.map((agent) =>
                agent.id === data.agent_id
                  ? { ...agent, is_online: data.is_online }
                  : agent,
              ),
            );
            break;
          case "service_status_update":
            setAgents((prevAgents) =>
              prevAgents.map((agent) =>
                agent.id === data.agent_id
                  ? {
                      ...agent,
                      services: agent.services.map((service) =>
                        service.id === data.service_id
                          ? {
                              ...service,
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
            setAgents((prevAgents) =>
              prevAgents.map((agent) =>
                agent.id === data.agent_id
                  ? {
                      ...agent,
                      services: agent.services.filter(
                        (service) => service.id !== data.service_id,
                      ),
                    }
                  : agent,
              ),
            );
            break;
          case "service_added":
            setAgents((prevAgents) =>
              prevAgents.map((agent) =>
                agent.id === data.agent_id
                  ? {
                      ...agent,
                      services: [
                        ...agent.services,
                        mapService({
                          service_id: data.service_id,
                          name: data.name,
                          description: data.description,
                          version: data.version,
                          schedule: data.schedule,
                          last_status: data.last_status,
                          last_message: data.last_message,
                          last_seen: data.last_seen,
                        }),
                      ],
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
      // console.log("Close SSE connection.");
      setLoading(false);
      setIsConnected(false);
    });

    return () => {
      es.close();
    };
  }, [auth]);

  return { agents, loading, isConnected };
}

function mapAgents(agents: AgentSSE[]): Agent[] {
  return agents.map((agent) => ({
    id: agent.agent_id,
    name: agent.agent_name,
    is_online: agent.is_online,
    ip_address: agent.ip_address,
    services: agent.services.map((service) => mapService(service)),
  }));
}

function mapService(service: ServiceSSE): Service {
  return {
    id: service.service_id, // This is a "agent_service_id" not the real service ID in DB
    name: service.name,
    description: service.description,
    version: service.version,
    schedule: service.schedule,
    last_status: service.last_status,
    last_message: service.last_message,
    last_seen: dateStringToDate(service.last_seen),
  };
}

function dateStringToDate(dateString: string | null): Date | null {
  if (dateString === null) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}

export default useAgentsSSE;
