import { Service } from "./services";

/**
 * Represents the registration status of an agent.
 * Based on core.models.Agent.RegistrationStatus
 */
export type AgentRegistrationStatus = "pending" | "registered" | "unregistered";

/**
 * Represents the status of an agent registration process.
 * Based on core.models.AgentRegistration.STATUS_CHOICES
 */
export type AgentRegistrationProcessStatus =
  "pending" | "completed" | "expired";

/**
 * Serializer for the Agent model.
 * Based on core.serializers.AgentSerializer
 */
export interface Agent {
  id: string; // UUID
  name: string;
  ip_address: string | null;
  is_online: boolean;
  registration_status?: AgentRegistrationStatus;
  created_at?: string; // ISO 8601 date string
  last_seen?: Date | null;
  grace_period: number;
  services: Service[];
}

/**
 * Payload for the agent registration endpoint.
 * Based on core.serializers.AgentRegisterSerializer
 */
export interface AgentRegisterPayload {
  key: string; // UUID
}

/**
 * Data for an initiated agent registration process.
 * Based on core.serializers.AgentRegistrationSerializer
 */
export interface AgentRegistration {
  id: string; // UUID
  code: string;
  status: AgentRegistrationProcessStatus;
  expires_at: string; // ISO 8601 date string
}

/**
 * Payload for completing agent registration with a code.
 * Based on core.serializers.CompleteAgentRegistrationSerializer
 */
export interface CompleteAgentRegistrationPayload {
  code: string;
}
