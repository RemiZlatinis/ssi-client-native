/**
 * Represents the possible operating systems for a device.
 * Based on `notifications.models.Device.OS_CHOICES`.
 */
export type DeviceOS = "Android" | "iOS" | "iPadOS" | "Windows" | "Unknown";

/**
 * Represents the status of a device.
 * Based on `notifications.models.Device.STATUS_CHOICES`.
 */
export type DeviceStatus = "active" | "inactive";

/**
 * Interface for the data required to create a new device.
 * Corresponds to `DeviceCreateSerializer`.
 */
export interface DeviceCreate {
  token: string;
  manufacturer: string;
  model_name: string;
  device_name: string;
  os_name: DeviceOS;
  os_version: string;
}

/**
 * Interface for the data used to update a device.
 * The fields are optional to support PATCH requests.
 * Corresponds to `DeviceUpdateSerializer`.
 */
export interface DeviceUpdate {
  device_name?: string;
  status?: DeviceStatus;
}

/**
 * Interface for a device object retrieved from the API.
 * Corresponds to `DeviceRetrieveSerializer`.
 */
export interface Device extends DeviceCreate {
  id: number;
  status: DeviceStatus;
  added_at: string; // ISO 8601 date-time string
  updated_at: string; // ISO 8601 date-time string
}
