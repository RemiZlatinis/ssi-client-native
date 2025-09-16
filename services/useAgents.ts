import { useCallback, useEffect, useState } from "react";

import { Agent } from "@/types";
import config from "@/config";
import useAuth from "@/auth/useAuth";

function useAgents() {
  const { auth } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAgents = useCallback(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetch(
          `${config.BACKEND.BASE_URL}${config.BACKEND.AGENTS}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${auth?.access}`,
              "Content-Type": "application/json",
            },
          },
        );
        const data = await response.json();
        setAgents(mapAgents(data));
      } catch (error) {
        console.error("Error fetching agents:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [auth]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  function refresh() {
    fetchAgents();
  }

  return { agents, refresh, loading, refreshing: loading };
}

function dateStringToDate(dateString: string | undefined): Date | undefined {
  if (!dateString) return undefined;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? undefined : date;
}

function mapAgents(agents: any[]): Agent[] {
  return agents.map((agent) => ({
    id: agent.id,
    name: agent.name,
    is_online: agent.is_online,
    services: agent.services.map((service: any) => ({
      name: service.name,
      description: service.description,
      version: service.version,
      schedule: service.schedule,
      last_status: service.last_status,
      last_message: service.last_message,
      last_seen: dateStringToDate(service.last_seen),
    })),
  }));
}

export default useAgents;
