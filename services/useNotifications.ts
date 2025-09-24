import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

import { DeviceCreate } from "@/types/notifications";
import config from "@/config";
import useAuth from "@/auth/useAuth";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      handleRegistrationError(
        "Permission not granted to get push token for push notification!",
      );
      return;
    }

    const projectId = Constants.expoConfig?.extra?.eas?.projectId;

    if (!projectId) {
      handleRegistrationError("Project ID not found");
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications");
  }
}

function useNotifications() {
  const { auth } = useAuth();
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>(
    [],
  );
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);

  async function registerDevice(device: DeviceCreate) {
    if (!auth) {
      console.debug("No auth found. Trying to register device without auth?");
      return;
    }

    try {
      const responses = await fetch(
        `${config.BACKEND.BASE_URL}${config.BACKEND.NOTIFICATIONS_DEVICES}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${auth.access}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(device),
        },
      );

      if (responses.ok) console.debug("Device registered successfully.");
      else console.debug("Error registering device:", responses);
    } catch (error) {
      console.error("Error registering device:", error);
    }
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (!token) return;

      registerDevice({
        token,
        manufacturer: Device.manufacturer ?? "Unknown",
        model_name: Device.modelName ?? "Unknown",
        device_name: Device.deviceName ?? "Unknown",
        os_name:
          Device.osName === "Android"
            ? "Android"
            : Device.osName === "iOS"
              ? "iOS"
              : "Unknown",
        os_version: Device.osVersion ?? "",
      });
    });

    if (Platform.OS === "android") {
      Notifications.getNotificationChannelsAsync().then((value) =>
        setChannels(value ?? []),
      );
    }
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      },
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return {};
}

export default useNotifications;
