import React from "react";
import { useLocalSearchParams, router } from "expo-router";
import { Alert } from "react-native";

import { Device } from "@/types/notifications";
import config from "@/config";
import { useAuthContext } from "@/auth/AuthContext";
import EditTextFieldScreen from "@/components/containers/EditTextFieldScreen";

function EditDeviceName() {
  const { device: deviceString } = useLocalSearchParams();
  const { auth } = useAuthContext();

  if (
    !deviceString ||
    typeof deviceString !== "string" ||
    Array.isArray(deviceString)
  ) {
    Alert.alert("Error", "Invalid device parameter");
    router.back();
    return null;
  }

  let device: Device;
  try {
    device = JSON.parse(deviceString);
  } catch {
    Alert.alert("Error", "Invalid device data");
    router.back();
    return null;
  }

  const handleSave = async (newName: string) => {
    if (!auth) return;

    try {
      const response = await fetch(
        `${config.BACKEND.BASE_URL}${config.BACKEND.NOTIFICATIONS_DEVICES}${device.id}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${auth.access}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ device_name: newName }),
        },
      );
      if (response.ok) {
        router.back();
      } else {
        Alert.alert("Error", "Failed to update device name");
      }
    } catch {
      Alert.alert("Error", "Network error");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <EditTextFieldScreen
      initialValue={device.device_name}
      onSave={handleSave}
      onCancel={handleCancel}
      placeholder="Enter device name"
      title="Edit Device Name"
    />
  );
}

export default EditDeviceName;
