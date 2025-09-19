import EvilIcons from "@expo/vector-icons/EvilIcons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, StatusBar, StyleSheet, Text, View } from "react-native";

import useAuth from "@/auth/useAuth";
import Button from "@/components/buttons/AppButton";
import AppScreen from "@/components/containers/AppScreen";
import TextInput from "@/components/texts/AppTextInput";
import config from "@/config";

export default function EditAgentScreen() {
  const { auth } = useAuth();
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const [agentName, setAgentName] = useState(name || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!agentName.trim()) {
      Alert.alert("Validation Error", "Agent name cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${config.BACKEND.BASE_URL + config.BACKEND.AGENTS + id}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${auth?.access}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: agentName }),
        },
      );

      if (res.ok) {
        // Alert.alert("Success", "Agent name updated successfully.");
        router.replace("/");
        setLoading(false);
      } else {
        const errorData = await res.json();
        Alert.alert(
          "Update Failed",
          errorData.detail || `An error occurred: ${res.status}`,
        );
      }
    } catch (error) {
      console.error("Failed to update agent name:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <AppScreen style={styles.container}>
      <Text style={styles.title}>Edit Agent</Text>
      <EvilIcons
        name="close"
        size={32}
        style={styles.closeButton}
        onPress={() => router.back()}
      />
      <View style={styles.formContainer}>
        <Text style={styles.note}>Enter the new name for the agent.</Text>
        <View style={styles.separator} />
        <TextInput
          textInputProps={{
            value: agentName,
            onChangeText: setAgentName,
            placeholder: "Agent Name",
          }}
        />
        <View style={styles.separator} />
        <Button
          title={loading ? "Updating..." : "Update Agent"}
          onPress={handleUpdate}
          disabled={loading || !agentName.trim()}
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    flex: 1,
  },
  title: {
    marginVertical: 20,
    fontSize: 20,
    fontFamily: "BrunoAce",
    textAlign: "center",
    color: "#E8F2F7",
  },
  closeButton: {
    position: "absolute",
    top: (StatusBar.currentHeight || 0) + 15,
    right: 20,
    color: "#E8F2F7",
  },
  note: {
    color: "#37A9E1",
    fontFamily: "Poppins-ExtraLight",
    textAlign: "center",
    maxWidth: "90%",
    marginHorizontal: "auto",
    fontSize: 16,
    paddingBottom: 20,
  },
  separator: {
    marginVertical: 20,
    height: 1,
    backgroundColor: "#185E81",
    alignSelf: "center",
    opacity: 0.2,
    width: "60%",
  },
  formContainer: {
    position: "absolute",
    alignSelf: "center",
    top: "30%",
    width: "80%",
  },
});
