import { registerDeviceToken } from "@/api/devices";
import useAuth from "@/auth/useAuth";
import {
  getPushTokenAsync,
  registerAndroidChannels,
  setupNotificationHandler,
} from "@/services/notifications";
import { DeviceOS } from "@/types/notifications";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";

// Initialize config immediately (can be done in App.tsx too)
setupNotificationHandler();

export function usePushNotifications() {
  const { auth } = useAuth();

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
    let isMounted = true;

    const register = async () => {
      // 1. Setup Channels
      await registerAndroidChannels();

      // 2. Get Token
      const token = await getPushTokenAsync();

      // 3. Send to Backend (only if we have a token and a user)
      if (token && auth?.access && isMounted) {
        const deviceData = {
          token,
          manufacturer: Device.manufacturer ?? "Unknown",
          model_name: Device.modelName ?? "Unknown",
          device_name: Device.deviceName ?? "Unknown",
          os_name: (Device.osName as DeviceOS) ?? "Unknown",
          os_version: Device.osVersion ?? "",
        };

        await registerDeviceToken(deviceData, auth.access);
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
  }, [auth?.access]);

  return { notification };
}
