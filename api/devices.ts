import config from "@/config";
import { DeviceCreate } from "@/types/notifications";

export async function registerDeviceToken(
  deviceData: DeviceCreate,
  accessToken: string,
): Promise<boolean> {
  try {
    const response = await fetch(
      `${config.BACKEND.BASE_URL}${config.BACKEND.NOTIFICATIONS_DEVICES}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deviceData),
      },
    );
    return response.ok;
  } catch (error) {
    console.error("API call failed", error);
    return false;
  }
}
