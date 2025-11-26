import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { ANDROID_CHANNELS } from "@/config/notifications";

// Global Handler (How notifications behave when app is foregrounded)
export function setupNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

// Register Channels (Android Specific)
export async function registerAndroidChannels() {
  if (Platform.OS === "android") {
    for (const channel of ANDROID_CHANNELS) {
      if (channel.id) {
        await Notifications.setNotificationChannelAsync(channel.id, channel);
      }
    }
  }
}

// Get Permission & Token
export async function getPushTokenAsync(): Promise<string | null> {
  if (!Device.isDevice) {
    console.warn("Must use physical device for push notifications");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.warn("Failed to get push token for push notification!");
    return null;
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.expoConfig?.extra?.projectId;

  if (!projectId) {
    throw new Error("Project ID not found in Expo Config");
  }

  try {
    const pushTokenString = (
      await Notifications.getExpoPushTokenAsync({ projectId })
    ).data;
    return pushTokenString;
  } catch (e) {
    console.error("Error fetching push token", e);
    return null;
  }
}
