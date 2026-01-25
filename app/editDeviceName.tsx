import React from "react";
import { useLocalSearchParams, router } from "expo-router";
import { Alert } from "react-native";

import api from "@/api";
import EditTextFieldScreen from "@/components/containers/EditTextFieldScreen";

import { Device } from "@/types";

function EditDeviceName() {
  const { device: deviceString } = useLocalSearchParams();

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
    try {
      const updatedDevice = await api.notifications.updateDevice(device.id, {
        device_name: newName,
      });

      if (updatedDevice) {
        router.back();
      } else {
        Alert.alert("Error", "Failed to update device name");
      }
    } catch (error) {
      console.error("Error updating device name:", error);
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
