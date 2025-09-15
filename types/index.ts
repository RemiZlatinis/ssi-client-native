export type Status = "OK" | "UPDATE" | "WARNING" | "FAILURE" | "ERROR" | null;

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  picture: string | null;
}

export interface AuthObject {
  access: string;
  refresh: string;
  user: User;
}

export interface AgentService {
  id: string;
  service_id: string; // Provided by the service-script itself
  name: string;
  description?: string;
  version?: string;
  schedule?: string;
  last_status: Status;
  last_message?: string;
  last_seen?: Date;
}

export interface AgentServiceSSE {
  service_id: string;
  name: string;
  description?: string;
  version?: string;
  schedule?: string;
  last_status: Status;
  last_message?: string;
  last_seen?: Date;
}

export interface Agent {
  id: string;
  name: string;
  is_online: boolean;
  services: AgentService[];
}

export interface AgentSSE {
  id: string;
  name: string;
  is_online: boolean;
  ip_address: string;
  registration_status: "pending" | "registered" | "unregistered";
  services: AgentServiceSSE[];
}

export interface InitialStatusEvent {
  type: "initial_status";
  agents: AgentSSE[];
}

export interface AgentStatusUpdateEvent {
  type: "agent_status_update";
  agent_id: string;
  agent_name: string;
  is_online: boolean;
}

export interface ServiceStatusUpdateEvent {
  type: "service_status_update";
  agent_id: string;
  agent_name: string;
  service_id: string;
  status: Status;
  message: string;
  timestamp: string;
}

export interface ServiceRemovedEvent {
  type: "service_removed";
  agent_id: string;
  agent_name: string;
  service_id: string;
}

export interface ServiceAddedEvent {
  type: "service_added";
  agent_id: string;
  agent_name: string;
  service_id: string;
  name: string;
  description: string;
  version: string;
  schedule: string;
  last_status: Status;
  last_message: string;
  last_seen: string;
}

export type SSEMessage =
  | InitialStatusEvent
  | AgentStatusUpdateEvent
  | ServiceStatusUpdateEvent
  | ServiceRemovedEvent
  | ServiceAddedEvent;
