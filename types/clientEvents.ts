import { AgentRegistrationStatus } from "./agents";
import { ServiceStatus } from "./services";

// --- Models ---

export interface ClientServiceData {
  id: string; // This is the human readable service-id
  name: string;
  description: string;
  version: string;
  schedule: string;
  last_message: string;
  last_seen: string | null;
  last_status: ServiceStatus;
}

export interface ClientAgentData {
  id: string;
  name: string;
  registration_status: AgentRegistrationStatus;
  services: ClientServiceData[];
  ip_address: string | null;
  is_online: boolean;
  last_seen: string | null;
  grace_period: number;
}

// --- Payloads ---

export interface ClientInitialStatusPayload {
  agents: ClientAgentData[];
}

export interface ClientStatusUpdatePayload {
  agent: ClientAgentData;
}

export interface ClientServiceAddedPayload {
  agent_id: string;
  service: ClientServiceData;
}

export interface ClientServiceRemovedPayload {
  agent_id: string;
  service_id: string;
}

export interface ClientServiceStatusUpdatePayload {
  agent_id: string;
  service_id: string;
  status: ServiceStatus;
  message: string;
  timestamp: string;
}

// --- Events ---

export interface ClientInitialStatusEvent {
  type: "client.initial_status";
  data: ClientInitialStatusPayload;
}

export interface ClientStatusUpdateEvent {
  type: "client.status_update";
  data: ClientStatusUpdatePayload;
}

export interface ClientServiceAddedEvent {
  type: "client.service_added";
  data: ClientServiceAddedPayload;
}

export interface ClientServiceRemovedEvent {
  type: "client.service_removed";
  data: ClientServiceRemovedPayload;
}

export interface ClientServiceStatusUpdateEvent {
  type: "client.service_status_update";
  data: ClientServiceStatusUpdatePayload;
}

export type ClientEvent =
  | ClientInitialStatusEvent
  | ClientStatusUpdateEvent
  | ClientServiceAddedEvent
  | ClientServiceRemovedEvent
  | ClientServiceStatusUpdateEvent;
