/**
 * Represents the possible statuses of a service.
 * Based on core.models.Service.Status
 */
export type ServiceStatus =
  | "OK"
  | "WARNING"
  | "ERROR"
  | "UPDATE"
  | "FAILURE"
  | "UNKNOWN";

/**
 * Serializer for the Service model.
 * Based on core.serializers.ServiceSerializer
 */
export interface Service {
  // The id="agent_service_id" which is the ID of the service on the agent,
  // is unique for each agent/service is NOT the unique service ID from DB
  id: string;
  name: string;
  description: string;
  version: string;
  schedule: string;
  last_status: ServiceStatus;
  last_message: string;
  last_seen: Date | null; // Assume is mapped
}
