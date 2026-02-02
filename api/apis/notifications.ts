import client from "../lib/client";

import { Device, DeviceCreate, DeviceUpdate } from "@/types";

const ENDPOINTS = {
  devices: `notifications/devices/`,
  device: (id: number) => `notifications/devices/${id}/`,
  test: (id: number) => `notifications/devices/${id}/test/`,
};

async function registerDevice(deviceData: DeviceCreate): Promise<void> {
  const response = await client.post(ENDPOINTS.devices, deviceData);

  if (!response.ok)
    return console.error("Device registration failed", response);
}

async function getDevices(): Promise<Device[] | null> {
  const response = await client.get<Device[]>(ENDPOINTS.devices);

  if (!response.ok) {
    console.error("Failed to fetch devices", response);
    return null;
  }

  return response.data || [];
}

async function updateDevice(
  id: number,
  deviceData: DeviceUpdate,
): Promise<Device | null> {
  const response = await client.patch<Device>(ENDPOINTS.device(id), deviceData);

  if (!response.ok) {
    console.error("Failed to update device", response);
    return null;
  }

  return response.data || null;
}

async function sendTestNotification(id: number): Promise<boolean> {
  const response = await client.post(ENDPOINTS.test(id));

  if (!response.ok) {
    console.error("Failed to send test notification", response);
    return false;
  }

  return true;
}

export default {
  registerDevice,
  getDevices,
  updateDevice,
  sendTestNotification,
};
