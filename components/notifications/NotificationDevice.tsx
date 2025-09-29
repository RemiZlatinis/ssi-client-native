import React, { useState, useEffect } from "react";
import { View, StyleSheet, Switch, Alert, Pressable } from "react-native";
import { router } from "expo-router";

import { Device } from "@/types/notifications";
import config from "@/config";
import { useAuthContext } from "@/auth/AuthContext";
import AppText from "@/components/texts/AppText";
import AppButton from "@/components/buttons/AppButton";
import AppContainer from "@/components/containers/AppContainer";

function NotificationDevice({ device }: { device: Device }) {
  const { auth } = useAuthContext();
  const [isActive, setIsActive] = useState(device.status === "active");
  const [updating, setUpdating] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    if (!updating && !testing) {
      setIsActive(device.status === "active");
    }
  }, [device.status, updating, testing]);

  const toggleStatus = async () => {
    if (!auth) return;
    setUpdating(true);
    try {
      const response = await fetch(
        `${config.BACKEND.BASE_URL}${config.BACKEND.NOTIFICATIONS_DEVICES}${device.id}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${auth.access}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: isActive ? "inactive" : "active" }),
        },
      );

      if (response.ok) setIsActive(!isActive);
      else Alert.alert("Error", "Failed to update device status");
      setUpdating(false);
    } catch {
      Alert.alert("Error", "Network error");
      setUpdating(false);
    }
  };

  const sendTestNotification = async () => {
    if (!auth) return;
    setTesting(true);
    try {
      const response = await fetch(
        `${config.BACKEND.BASE_URL}${config.BACKEND.NOTIFICATIONS_DEVICES}${device.id}/test/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${auth.access}`,
          },
        },
      );

      if (response.ok) console.debug("Success: Test notification sent!");
      else Alert.alert("Error", "Failed to send test notification");
      setTesting(false);
    } catch {
      Alert.alert("Error", "Network error");
      setTesting(false);
    }
  };

  const handleLongPress = () => {
    router.push({
      pathname: "/editDeviceName",
      params: { device: JSON.stringify(device) },
    });
  };

  return (
    <AppContainer color="secondary">
      <Pressable onLongPress={handleLongPress}>
        <AppText fontWidth="bold" color="primary" size={18}>
          {device.device_name}
        </AppText>
      </Pressable>
      <AppText fontWidth="normal" color="dark" size={14}>
        {device.manufacturer} {device.model_name}
      </AppText>
      <AppText fontWidth="normal" color="grey" size={12}>
        {device.os_name} {device.os_version}
      </AppText>
      <View style={styles.switchContainer}>
        <AppText fontWidth="medium" color="primary" size={16}>
          Active
        </AppText>
        <Switch
          value={isActive}
          onValueChange={toggleStatus}
          disabled={updating}
        />
      </View>
      <AppButton
        title={testing ? "Sending..." : "Send Test Notification"}
        onPress={sendTestNotification}
        disabled={testing}
        style={styles.button}
        fontSize={16}
      />
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  button: {
    marginTop: 10,
    height: 40,
  },
});

export default NotificationDevice;
