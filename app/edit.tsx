import EvilIcons from "@expo/vector-icons/EvilIcons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, StatusBar, StyleSheet, Text, View } from "react-native";

import Button from "@/components/buttons/AppButton";
import AppScreen from "@/components/containers/AppScreen";
import TextInput from "@/components/texts/AppTextInput";

import api from "@/api";

export default function EditAgentScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const [agentName, setAgentName] = useState(name || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!agentName.trim()) {
      Alert.alert("Validation Error", "Agent name cannot be empty.");
      return;
    }

    setLoading(true);
    await api.agents.updateAgent(id, { name: agentName });
    setLoading(false);
    router.replace("/");
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
