import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import "react-native-reanimated";

import { AgentsProvider } from "@/contexts/AgentsContext";
import { AuthProvider } from "@/auth/AuthContext";
import useAuth from "@/auth/useAuth";
import { useAppFonts } from "@/hooks/useAppFonts";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
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
      <AgentsProvider>
        <RootLayoutNav />
      </AgentsProvider>
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const [fontsLoaded, error] = useAppFonts();
  const dark = useColorScheme();
  const { auth, restoreAuthObject } = useAuth();

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    restoreAuthObject();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  const isAuthenticated = auth != null;
  return (
    <ThemeProvider value={dark ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="index" />
          <Stack.Screen name="menu" />
          <Stack.Screen
            name="add"
            options={{ presentation: "modal", animation: "fade_from_bottom" }}
          />
          <Stack.Screen
            name="edit"
            options={{ presentation: "modal", animation: "fade_from_bottom" }}
          />
          <Stack.Screen
            name="editDeviceName"
            options={{ presentation: "fullScreenModal" }}
          />
        </Stack.Protected>
        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="welcome" />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}
