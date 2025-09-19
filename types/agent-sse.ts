import { AgentRegistrationStatus } from "./agents";
import { ServiceStatus } from "./services";

/**
 * Represents a Service as defined in the SSE payloads.
 * Note: `service_id` corresponds to `agent_service_id` in the database model.
 */
export interface ServiceSSE {
  service_id: string;
  name: string;
  description: string;
  version: string;
  schedule: string;
  last_status: ServiceStatus;
  last_message: string;
  last_seen: string | null; // ISO 8601 date string or null
}

/**
 * Represents an Agent as defined in the initial SSE status payload.
 * Note: `agent_id` corresponds to the agent's primary key, but is a string.
 */
export interface AgentSSE {
  agent_id: string;
  agent_name: string;
  is_online: boolean;
  ip_address: string | null;
  registration_status: AgentRegistrationStatus;
  services: ServiceSSE[];
}

export const KNOWN_AGENT_SSE_TYPES = [
  "initial_status",
  "agent_status_update",
  "service_status_update",
  "service_removed",
  "service_added",
] as const;

export type KnownAgentSSETypes = (typeof KNOWN_AGENT_SSE_TYPES)[number];

// --- Discriminated Union for SSE Message Payloads ---

/**
 * Payload for the 'initial_status' event, sent once on connection.
 * Contains the full state of all agents and services for the user.
 */
export interface InitialStatusMessageSSE {
  type: "initial_status";
  agents: AgentSSE[];
}

/**
 * Payload for the 'agent_status_update' event.
 * Sent when an agent connects, disconnects, or is renamed.
 */
export interface AgentStatusUpdateMessageSSE {
  type: "agent_status_update";
  agent_id: string;
  agent_name: string;
  is_online: boolean;
  ip_address: string | null;
}

/**
 * Payload for the 'service_status_update' event.
 * Sent when a service reports a new status.
 */
export interface ServiceStatusUpdateMessageSSE {
  type: "service_status_update";
  agent_id: string;
  agent_name: string;
  service_id: string;
  status: ServiceStatus;
  message: string;
  timestamp: string; // ISO 8601 date string
}

/**
 * Payload for the 'service_removed' event.
 * Sent when a service is removed from an agent.
 */
export interface ServiceRemovedMessageSSE {
  type: "service_removed";
  agent_id: string;
  agent_name: string;
  service_id: string;
}

/**
 * Payload for the 'service_added' event.
 * Sent when a new service is added to an agent.
 * This payload contains the full details of the new service.
 */
export interface ServiceAddedMessageSSE extends ServiceSSE {
  type: "service_added";
  agent_id: string;
  agent_name: string;
}

/**
 * A discriminated union of all possible valid SSE message payloads.
 * You can use the 'type' property to determine how to process the message.
 */
export type MessageSSE =
  | InitialStatusMessageSSE
  | AgentStatusUpdateMessageSSE
  | ServiceStatusUpdateMessageSSE
  | ServiceRemovedMessageSSE
  | ServiceAddedMessageSSE;
