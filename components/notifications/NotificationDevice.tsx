import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Switch, View } from "react-native";

import api from "@/api";
import AppButton from "@/components/buttons/AppButton";
import AppContainer from "@/components/containers/AppContainer";
import AppText from "@/components/texts/AppText";
import { Device } from "@/types";

function NotificationDevice({
  device,
  onIsActiveToggle,
}: {
  device: Device;
  onIsActiveToggle: () => void;
}) {
  const [updating, setUpdating] = useState(false);
  const [testing, setTesting] = useState(false);

  const toggleStatus = async () => {
    setUpdating(true);

    onIsActiveToggle();
    try {
      const updatedDevice = await api.notifications.updateDevice(device.id, {
        status: device.status === "active" ? "inactive" : "active",
      });

      if (!updatedDevice) {
        onIsActiveToggle();
        Alert.alert("Error", "Failed to update device status");
      }
    } catch (error) {
      console.error("Error updating device status:", error);
      onIsActiveToggle();
      Alert.alert("Error", "Network error");
    } finally {
      setUpdating(false);
    }
  };

  const sendTestNotification = async () => {
    setTesting(true);
    try {
      const success = await api.notifications.sendTestNotification(device.id);

      if (success) {
        console.debug("Success: Test notification sent!");
      } else {
        Alert.alert("Error", "Failed to send test notification");
      }
    } catch (error) {
      console.error("Error sending test notification:", error);
      Alert.alert("Error", "Network error");
    } finally {
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
          value={device.status === "active"}
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
