import { Image } from "expo-image";
import { StyleSheet, Text, useColorScheme, View, Platform } from "react-native";

import LoginWithGoogleButton from "@/auth/components/LoginWithGoogleButton";
import useAuth from "@/auth/useAuth";
import LoaderCat from "@/components/animations/LoaderCat";
import AppScreen from "@/components/containers/AppScreen";

const logo = require("@/assets/images/icon.png");

export default function WelcomeScreen() {
  const { loading } = useAuth();
  const dark = useColorScheme() === "dark";

  return (
    <AppScreen style={styles.screen}>
      {/* Brand */}
      <View style={styles.brandContainer}>
        {/* Logo */}
        <View style={[styles.logoContainer, dark && styles.logoContainerDark]}>
          <Image source={logo} style={styles.logo} />
        </View>
        <Text style={styles.title}>Service Status Indicator</Text>
        <Text style={styles.subtitle}>Simplified Monitoring Framework</Text>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Login...</Text>
          <LoaderCat />
        </View>
      ) : (
        <LoginWithGoogleButton />
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 20,
    backgroundColor: "#185E81",
    paddingBottom: 60,
  },
  brandContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Platform.OS === "web" ? 80 : "auto",
    marginTop: 100,
  },
  logoContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 75,
    height: 150,
    justifyContent: "center",
    width: 150,
  },
  logoContainerDark: {
    backgroundColor: "#091620",
  },
  logo: {
    height: 100,
    width: 100,
  },
  title: {
    color: "#E8F2F7",
    fontFamily: "BrunoAce",
    fontSize: 20,
    marginTop: 20,
    textAlign: "center",
  },
  subtitle: {
    color: "#84C2E1",
    fontFamily: "Poppins-Light",
    fontSize: 14,
    textAlign: "center",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#84C2E1",
    fontFamily: "BrunoAce",
    fontSize: 20,
  },
});
