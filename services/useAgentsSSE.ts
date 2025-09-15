import { useState } from "react";
import EventSource from "react-native-sse";

import useAuth from "@/auth/useAuth";
import config from "@/config";
import { Agent } from "@/types";

function useAgentsSSE() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const { auth } = useAuth();

  if (!auth) return null;

  const es = new EventSource(
    config.BACKEND.BASE_URL + config.BACKEND.AGENTS_SSE,
    { headers: { Authorization: `Bearer ${auth.access}` } }
  );

  es.addEventListener("message", (event) => {
    try {
      console.log("New message event:", event.data);

      // switch (data.type) {
      //   case "initial_status":
      //     dispatch({ type: "SET_INITIAL_STATUS", payload: data.agents });
      //     break;
      //   case "agent_status_update":
      //     dispatch({ type: "UPDATE_AGENT_STATUS", payload: data });
      //     break;
      //   case "service_status_update":
      //     dispatch({ type: "UPDATE_SERVICE_STATUS", payload: data });
      //     break;
      //   default:
      //     console.warn("Unknown SSE event type:", data.type);
      // }
    } catch (error) {
      console.error("Error parsing SSE message:", error, event.data);
    }
  });
}

export default useAgentsSSE;
