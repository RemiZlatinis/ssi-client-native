import {
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
} from "@expo-google-fonts/poppins";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import "react-native-reanimated";

import { AuthProvider } from "@/auth/AuthContext";
import useAuth from "@/auth/useAuth";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const [fontsLoaded, error] = useFonts({
    BrunoAce: require("../assets/fonts/BrunoAce-Regular.ttf"),
    "Poppins-Light": Poppins_300Light,
    Poppins: Poppins_400Regular,
    "Poppins-Medium": Poppins_500Medium,
    ...FontAwesome.font,
  });
  const dark = useColorScheme();
  const { auth, restoreAuthObject, loading: loadingAuth } = useAuth();

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    restoreAuthObject();
  }, []);

  useEffect(() => {
    if (fontsLoaded && !loadingAuth) {
      console.log("Fonts loaded and auth restored, hiding splash screen");
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, loadingAuth]);

  if (!fontsLoaded || loadingAuth) {
    return null;
  }

  const isAuthenticated = auth != null;
  return (
    <ThemeProvider value={dark ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="index" />
          <Stack.Screen
            name="menu"
            options={{ presentation: "modal", animation: "fade_from_bottom" }}
          />
        </Stack.Protected>
        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="welcome" />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}
