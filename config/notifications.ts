import * as Notifications from "expo-notifications";
import { NotificationChannelInput } from "expo-notifications";

// Since NotificationChannelInput does not accept id,
// we need to define our own interface that extends it to include the ID,
// so we can store them in a single array configuration.
export interface AppNotificationChannel extends NotificationChannelInput {
  id: string;
}

export const NOTIFICATION_THEME = {
  lightColor: "#185e81",
  icon: "./assets/images/icon.png",
};

export const ANDROID_CHANNELS: AppNotificationChannel[] = [
  {
    id: "default",
    // NOTE: groupId is omitted because we aren't grouping anything yet.

    // Explicitly setting all properties for clarity:
    name: "Default",
    description: "Default notifications channel for general alerts.",
    importance: Notifications.AndroidImportance.DEFAULT,

    // Audio and Sound
    sound: "default",
    audioAttributes: {
      usage: Notifications.AndroidAudioUsage.NOTIFICATION,
      contentType: Notifications.AndroidAudioContentType.MUSIC,
    },

    // Visuals and Behavior
    lightColor: NOTIFICATION_THEME.lightColor,
    showBadge: true,
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,

    // Vibration/Lights (default to disabled unless specified)
    enableLights: false,
    enableVibrate: false,
    vibrationPattern: undefined, // Must be undefined if enableVibrate is false

    // Do Not Disturb (DND)
    bypassDnd: false,
  },
];
