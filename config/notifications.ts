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
  // Agent Stage Change
  {
    id: "agent-status",
    name: "Agent Status",
    description: "Notifications for Agent online/offline status changes.",
    importance: Notifications.AndroidImportance.DEFAULT,
    enableVibrate: false,
    enableLights: false,
    bypassDnd: false,
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
  },
  // Service Stage Change: OK
  {
    id: "service-ok",
    name: "Service: OK",
    description: "Information or regular stage updates.",
    importance: Notifications.AndroidImportance.DEFAULT,
    enableVibrate: false,
    enableLights: true,
    lightColor: "#158633ff", // Green
    bypassDnd: false,
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
  },
  // Service Stage Change: UPDATE
  {
    id: "service-update",
    name: "Service: Update",
    description: "Information about updates.",
    importance: Notifications.AndroidImportance.HIGH, // Slightly more important
    enableVibrate: true,
    vibrationPattern: [0, 250, 250, 250],
    enableLights: true,
    lightColor: "#3c7cd0ff", // Blue
    bypassDnd: false,
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
  },
  // Service Stage Change: WARNING
  {
    id: "service-warning",
    name: "Service: Warning",
    description: "Warning notifications.",
    importance: Notifications.AndroidImportance.HIGH, // Slightly more important than update (same tier, but distinct channel)
    enableVibrate: true,
    vibrationPattern: [0, 500, 200, 500],
    enableLights: true,
    lightColor: "#d8d86dff", // Yellow
    bypassDnd: false,
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
  },
  // Service Stage Change: FAILURE
  {
    id: "service-failure",
    name: "Service: Failure",
    description: "Failure notifications. User must know.",
    importance: Notifications.AndroidImportance.MAX, // Priority at max
    enableVibrate: true,
    vibrationPattern: [0, 1000, 500, 1000],
    enableLights: true,
    lightColor: "#c33d3dff", // Red
    bypassDnd: true, // User must grant DND access manually for this to work
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
  },
  // Service Stage Change: ERROR
  {
    id: "service-error",
    name: "Service: Error",
    description: "Runtime error notifications.",
    importance: Notifications.AndroidImportance.MAX, // Priority at max
    enableVibrate: true,
    vibrationPattern: [0, 1000, 500, 1000],
    enableLights: true,
    lightColor: "#c73c3cff", // Red
    bypassDnd: true, // User must grant DND access manually for this to work
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
  },
  // Service Stage Change: UNKNOWN
  {
    id: "service-unknown",
    name: "Service: Unknown",
    description: "Unknown status notifications.",
    importance: Notifications.AndroidImportance.DEFAULT,
    enableVibrate: false,
    enableLights: true,
    lightColor: "#8d989fff", // Grey
    bypassDnd: false,
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
  },
];

export const SERVICE_STATUS_TO_CHANNEL_ID: Record<string, string> = {
  OK: "service-ok",
  UPDATE: "service-update",
  WARNING: "service-warning",
  FAILURE: "service-failure",
  ERROR: "service-error",
  UNKNOWN: "service-unknown",
};
