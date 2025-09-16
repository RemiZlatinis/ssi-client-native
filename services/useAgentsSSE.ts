import { useEffect, useState } from "react";
import EventSource from "react-native-sse";

import useAuth from "@/auth/useAuth";
import config from "@/config";
import { Agent, AgentService, SSEMessage } from "@/types";

function useAgentsSSE() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const { auth } = useAuth();

  useEffect(() => {
    if (!auth) return;

    setLoading(true);
    const es = new EventSource(
      config.BACKEND.BASE_URL + config.BACKEND.AGENTS_SSE,
      { headers: { Authorization: `Bearer ${auth.access}` } },
    );

    // es.addEventListener("open", (event) => {
    //   console.log("Open SSE connection.");
    // });

    es.addEventListener("message", (event) => {
      try {
        if (!event.data) {
          console.warn("SSE message event data is null or empty.");
          return;
        }
        const data: SSEMessage = JSON.parse(event.data);
        // console.log("Received SSE message:", data);

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
                        service.service_id === data.service_id
                          ? mapService({
                              ...service,
                              last_status: data.status,
                              last_message: data.message,
                              last_seen: data.timestamp,
                            })
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
                        (service) => service.service_id !== data.service_id,
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
      console.error("SSE Error:", error);
      setLoading(false);
    });

    es.addEventListener("close", (event) => {
      // console.log("Close SSE connection.");
      setLoading(false);
    });

    return () => {
      es.close();
    };
  }, [auth]);

  return { agents, loading };
}

function dateStringToDate(dateString: string | undefined): Date | undefined {
  if (!dateString) return undefined;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? undefined : date;
}

export function mapAgents(agents: any[]): Agent[] {
  return agents.map((agent) => ({
    id: agent.agent_id,
    name: agent.agent_name,
    is_online: agent.is_online,
    services: agent.services.map((service: any) => mapService(service)),
  }));
}

export function mapService(service: any): AgentService {
  return {
    service_id: service.service_id,
    name: service.name,
    description: service.description,
    version: service.version,
    schedule: service.schedule,
    last_status: service.last_status,
    last_message: service.last_message,
    last_seen: dateStringToDate(service.last_seen),
  };
}

export default useAgentsSSE;
