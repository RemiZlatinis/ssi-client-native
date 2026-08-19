import { Image } from "expo-image";
import { Platform, StyleSheet, Text, useColorScheme, View } from "react-native";

import LoaderCat from "@/components/animated/LoaderCat";
import LoginWithGoogleButton from "@/components/buttons/LoginWithGoogleButton";
import AppScreen from "@/components/containers/AppScreen";
import { useBackendAvailability, useUser } from "@/hooks";

const logo = require("@/assets/images/icon.png");

export default function WelcomeScreen() {
  const dark = useColorScheme() === "dark";
  const { loading } = useUser();
  const backendAvailable = useBackendAvailability();

  return (
    <AppScreen style={styles.screen}>
      {/* Brand */}
      <View style={styles.brandContainer}>
        {/* Logo */}
        <View style={[styles.logoContainer, dark && styles.logoContainerDark]}>
          <Image source={logo} style={styles.logo} />
        </View>
        <Text style={styles.title}>Service Status Indicator</Text>
        <Text style={styles.subtitle}>
          Simplified Script-Driven Monitoring System
        </Text>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Login...</Text>
          <LoaderCat />
        </View>
      ) : (
        <LoginWithGoogleButton />
      )}
      {/* Pre-auth: shows when backend is unreachable before login.
          Post-auth: SSE disconnect covers this on the main screen. */}
      {backendAvailable === false && (
        <View style={styles.backendUnavailableBanner}>
          <Text style={styles.backendUnavailableBannerText}>
            {__DEV__
              ? "Backend unreachable — is it running?"
              : "Unable to connect to the server"}
          </Text>
        </View>
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
  backendUnavailableBanner: {
    backgroundColor: "#F59E0B",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 20,
    marginHorizontal: 20,
  },
  backendUnavailableBannerText: {
    color: "#000",
    fontFamily: "Poppins",
    fontSize: 13,
    textAlign: "center",
  },
});
