import EventSource from "react-native-sse";
import { createSSEConnection } from "../lib/sse";
import {
  ClientEvent,
  Agent,
  ClientServiceData,
  Service,
  ClientAgentData,
} from "@/types";
import { dateStringToDate } from "@/utils/date";
import client from "../lib/client";

const ENDPOINTS = {
  agents: "agents/",
};

const URI = {
  agentSSE: `sse/agents/`,
  agentRegistration: `agents/register/complete/`,
};

// --- Mappers ---
const mapToService = (service: ClientServiceData): Service => ({
  id: service.id,
  name: service.name,
  description: service.description,
  version: service.version,
  schedule: service.schedule,
  last_status: service.last_status,
  last_message: service.last_message,
  last_seen: service.last_seen ? dateStringToDate(service.last_seen) : null,
});

const mapToAgent = (data: ClientAgentData): Agent => ({
  id: data.id,
  name: data.name,
  is_online: data.is_online,
  ip_address: data.ip_address,
  last_seen: data.last_seen ? dateStringToDate(data.last_seen) : null,
  registration_status: data.registration_status,
  grace_period: data.grace_period,
  services: data.services.map((s) => mapToService(s)),
});

export type AgentsSSEEvent =
  | { type: "initial_status"; agents: Agent[] }
  | { type: "status_update"; agent: Agent }
  | { type: "service_added"; agent_id: string; service: Service }
  | { type: "service_removed"; agent_id: string; service_id: string }
  | {
      type: "service_status_update";
      agent_id: string;
      service_id: string;
      status: Service["last_status"];
      message: string;
      timestamp: Date | null;
    };

/**
 * Connects to the Agents SSE stream and sets up event listeners.
 */
async function agentsSSE(
  onOpen: () => void,
  onClose: () => void,
  onError: (error: unknown) => void,
  onReceiveEvent: (event: AgentsSSEEvent) => void,
): Promise<EventSource> {
  return await createSSEConnection(URI["agentSSE"], {
    onOpen,
    onClose,
    onError,
    onMessage: (data: string) => {
      try {
        const event: ClientEvent = JSON.parse(data);

        switch (event.type) {
          case "client.initial_status":
            onReceiveEvent({
              type: "initial_status",
              agents: event.data.agents.map(mapToAgent),
            });
            break;
          case "client.status_update":
            onReceiveEvent({
              type: "status_update",
              agent: mapToAgent(event.data.agent),
            });
            break;
          case "client.service_added":
            onReceiveEvent({
              type: "service_added",
              agent_id: event.data.agent_id,
              service: mapToService(event.data.service),
            });
            break;
          case "client.service_removed":
            onReceiveEvent({
              type: "service_removed",
              agent_id: event.data.agent_id,
              service_id: event.data.service_id,
            });
            break;
          case "client.service_status_update":
            onReceiveEvent({
              type: "service_status_update",
              agent_id: event.data.agent_id,
              service_id: event.data.service_id,
              status: event.data.status,
              message: event.data.message,
              timestamp: dateStringToDate(event.data.timestamp),
            });
            break;
        }
      } catch (error) {
        console.error("[SSE] Error parsing message:", error, data);
        onError(error);
      }
    },
  });
}

interface RegisterAgentResponse {
  message: string;
}

async function registerAgent(
  code: string,
): Promise<RegisterAgentResponse | void> {
  const response = await client.post<RegisterAgentResponse>(
    URI["agentRegistration"],
    { code },
  );

  if (!response.ok) {
    return console.error("[API] Error registering agent:", response);
  }

  return response.data;
}

async function updateAgent(
  agentId: string,
  data: { name?: string; grace_period?: number },
): Promise<void> {
  const response = await client.patch(`${ENDPOINTS.agents}${agentId}/`, data);

  if (!response.ok) {
    return console.error("[API] Error updating agent:", response);
  }
}

/**
 * Fetches a single agent by ID from the backend.
 */
async function getAgent(agentId: string): Promise<Agent | null> {
  const response = await client.get<ClientAgentData>(
    `${ENDPOINTS.agents}${agentId}/`,
  );

  if (!response.ok) {
    console.error("[API] Error fetching agent:", response);
    return null;
  }

  if (!response.data) {
    return null;
  }

  return mapToAgent(response.data);
}

export default {
  agentsSSE,
  registerAgent,
  updateAgent,
  getAgent,
};
