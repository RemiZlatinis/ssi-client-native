import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Device } from "@/types/notifications";
import config from "@/config";
import useAuth from "@/auth/useAuth";
import NotificationDevice from "@/components/notifications/NotificationDevice";
import LoaderCat from "@/components/animations/LoaderCat";

function NotificationsSettingsScreen() {
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState<Device[]>([]);
  const { auth } = useAuth();

  const fetchDevices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${config.BACKEND.BASE_URL + config.BACKEND.NOTIFICATIONS_DEVICES}`,
        {
          method: "GET",
          headers: {
            ...(auth?.access && { Authorization: `Bearer ${auth?.access}` }),
          },
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDevices(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching devices:", error);
      setLoading(false);
    }
  }, [auth?.access]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications Settings</Text>
      <Text style={styles.devicesTitle}>Devices</Text>
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <LoaderCat />
        </View>
      ) : (
        devices.map((device) => (
          <NotificationDevice key={device.id} device={device} />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
  },
  title: {
    fontSize: 24,
    color: "#185E81",
    fontFamily: "Poppins-Medium",
    textAlign: "center",
  },
  devicesTitle: {
    fontSize: 18,
    color: "#185E81",
    fontFamily: "Poppins-Medium",
  },
});

export default NotificationsSettingsScreen;
