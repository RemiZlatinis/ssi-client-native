import { router } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

import AppScreen from "@/components/containers/AppScreen";

export default function WelcomeScreen() {
  const handleLogin = () => {
    // After a successful login, you would replace the navigation stack
    // to prevent the user from going back to the welcome screen.
    router.replace("/overview");
  };

  return (
    <AppScreen>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}>
        Imagine two input fields for username and password.
      </Text>

      <View style={styles.buttonContainer}>
        <Button title="Login and Go to Overview" onPress={handleLogin} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginBottom: 30,
  },
  buttonContainer: {
    marginTop: 20,
  },
});
