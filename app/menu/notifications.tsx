import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import api from "@/api";
import { Device } from "@/types";
import NotificationDevice from "@/components/notifications/NotificationDevice";
import LoaderCat from "@/components/animated/LoaderCat";

function NotificationsSettingsScreen() {
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState<Device[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchDevices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.notifications.getDevices();
      if (data === null) {
        setError("Failed to load notification devices");
        setDevices([]);
      } else {
        setDevices(data);
      }
    } catch (err) {
      console.error("Error fetching devices:", err);
      setError("An unexpected error occurred");
      setDevices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const handleToggleIsActive = (deviceId: number) => {
    setDevices((prevDevices) =>
      prevDevices.map((device) =>
        device.id === deviceId
          ? {
              ...device,
              status: device.status === "active" ? "inactive" : "active",
            }
          : device,
      ),
    );
  };

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
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : devices.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No devices registered yet</Text>
        </View>
      ) : (
        devices.map((device) => (
          <NotificationDevice
            key={device.id}
            device={device}
            onIsActiveToggle={() => handleToggleIsActive(device.id)}
          />
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  errorText: {
    fontSize: 16,
    color: "#D32F2F",
    fontFamily: "Poppins-Regular",
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    fontFamily: "Poppins-Regular",
    textAlign: "center",
  },
});

export default NotificationsSettingsScreen;
