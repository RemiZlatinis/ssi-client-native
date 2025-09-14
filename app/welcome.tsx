import { Image } from "expo-image";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

import useAuth from "@/auth/useAuth";
import Button from "@/components/buttons/AppButton";
import AppScreen from "@/components/containers/AppScreen";
import TextInput from "@/components/texts/AppTextInput";

const logo = require("@/assets/images/icon.png");

export default function WelcomeScreen() {
  const dark = useColorScheme() === "dark";
  const { login, loading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <AppScreen style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {/* Logo */}
        <View style={[styles.logoContainer, dark && styles.logoContainerDark]}>
          <Image source={logo} style={styles.logo} />
        </View>

        {/* Brand */}
        <View>
          <Text style={styles.name}>Service Status Indicator</Text>
          <Text style={styles.subtitle}>Simplified Monitoring Framework</Text>
        </View>

        {/* Content */}
        <View style={{ width: "100%", gap: 10 }}>
          <TextInput
            textInputProps={{
              placeholder: "Username",
              textContentType: "username",
              autoCapitalize: "none",
              value: username,
              onChangeText: setUsername,
            }}
          />
          <TextInput
            textInputProps={{
              placeholder: "Password",
              secureTextEntry: true,
              textContentType: "password",
              autoCapitalize: "none",
              value: password,
              onChangeText: setPassword,
            }}
          />
        </View>
        <Button
          title={loading ? "Logging in..." : "Login"}
          onPress={() => login(username, password)}
          disabled={loading}
        />
      </KeyboardAvoidingView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 20,
    backgroundColor: "#185E81",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
  },

  // Logo
  logoContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainerDark: {
    backgroundColor: "#091620",
  },
  logo: {
    width: 100,
    height: 100,
  },

  // Brand
  name: {
    fontFamily: "BrunoAce",
    fontSize: 20,
    textAlign: "center",
    color: "#E8F2F7",
  },
  subtitle: {
    color: "#84C2E1",
    fontFamily: "Poppins-Light",
    fontSize: 14,
    textAlign: "center",
  },
});
