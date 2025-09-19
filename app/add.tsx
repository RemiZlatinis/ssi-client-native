import EvilIcons from "@expo/vector-icons/EvilIcons";
import { router } from "expo-router";
import { StatusBar, StyleSheet, Text, View } from "react-native";

import RegisterAgentCodeInput from "@/components/agents/RegisterAgentCodeInput";
import AppScreen from "@/components/containers/AppScreen";

export default function ModalScreen() {
  return (
    <AppScreen style={styles.container}>
      <Text style={styles.title}>Add Agent</Text>
      <EvilIcons
        name="close"
        size={32}
        style={styles.closeButton}
        onPress={() => router.back()}
      />
      <View style={styles.otpContainer}>
        <Text style={styles.note}>
          Type the registration code provided by the Agent CLI
        </Text>
        <View style={styles.separator} />
        <RegisterAgentCodeInput />
        <View style={styles.separator} />
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
  otpContainer: {
    position: "absolute",
    alignSelf: "center",
    top: "30%",
  },
});
