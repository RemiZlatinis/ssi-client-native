import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import "react-native-reanimated";

import { AgentsProvider } from "@/contexts/AgentsContext";
import { UserProvider, useUser } from "@/contexts/UserContext";
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

/**
 * The entry point of the application.
 *
 * This component wraps the RootLayout with the User Context Provider so it can be
 * accessed throughout the navigation tree where protected routes are set.
 */
export default function AppRootLayoutWrapper() {
  return (
    <UserProvider>
      <RootLayout />
    </UserProvider>
  );
}

function RootLayout() {
  const [fontsLoaded, errorLoadingFonts] = useAppFonts();
  const { user } = useUser();
  const dark = useColorScheme();

  useEffect(() => {
    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    if (errorLoadingFonts) throw errorLoadingFonts;
  }, [errorLoadingFonts]);

  useEffect(() => {
    if (fontsLoaded) {
      // Hide the Splash screen when fonts and user are loaded
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  const isLoggedIn = user != null;

  return (
    <ThemeProvider value={dark ? DarkTheme : DefaultTheme}>
      <AgentsProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Protected Routes */}
          <Stack.Protected guard={isLoggedIn}>
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

          {/* Public Routes */}
          <Stack.Protected guard={!isLoggedIn}>
            <Stack.Screen name="welcome" />
            <Stack.Screen name="auth/callback" />
          </Stack.Protected>
        </Stack>
      </AgentsProvider>
    </ThemeProvider>
  );
}
