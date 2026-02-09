import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";

import api from "@/api";

import {
  getPushTokenAsync,
  registerAndroidChannels,
  setupNotificationHandler,
} from "@/services/notifications";

import { DeviceOS } from "@/types";
import { Platform } from "react-native";

// Initialize config immediately (can be done in App.tsx too)
setupNotificationHandler();

function usePushNotifications() {
  // State for listeners (optional, if you need to display payload in UI)
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);

  // Refs to clean up listeners
  const notificationListener = useRef<Notifications.EventSubscription | null>(
    null,
  );
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    if (Platform.OS === "web") return;

    let isMounted = true;

    const register = async () => {
      // 1. Setup Channels
      await registerAndroidChannels();

      // 2. Get Token
      const token = await getPushTokenAsync();

      // 3. Send to Backend (only if we have a token and a user)
      if (token && isMounted) {
        const getDeviceOS = (): DeviceOS => {
          if (Platform.OS === "android") return "Android";
          if (Platform.OS === "ios") return "iOS";
          return "Unknown";
        };

        const deviceData = {
          token,
          manufacturer: Device.manufacturer ?? "Unknown",
          model_name: Device.modelName ?? "Unknown",
          device_name: Device.deviceName ?? "Unknown",
          os_name: getDeviceOS(),
          os_version: Device.osVersion ?? "",
        };

        await api.notifications.registerDevice(deviceData);
      }
    };

    register();

    // 4. Setup Listeners
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // Handle deep linking or navigation based on notification interaction here
        console.log("User interacted with notification:", response);
      });

    return () => {
      isMounted = false;
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  return { notification };
}

export default usePushNotifications;
