import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useRouter } from "expo-router";

import api from "@/api";

/**
 * OAuth callback route for browser-based authentication.
 *
 * This route is called after the OAuth provider (Google) redirects back
 * to the application. It verifies the session and redirects the user
 * to the appropriate screen.
 */
export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function verifySession() {
      try {
        await api.authentication.authenticate();
      } catch (err) {
        console.error("Session verification failed:", err);
        setError("An error occurred during authentication.");
        setTimeout(() => {
          router.replace("/welcome");
        }, 2000);
      }
    }

    verifySession();
  }, [router]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      {error ? (
        <>
          <Text style={{ fontSize: 16, marginBottom: 20, textAlign: "center" }}>
            {error}
          </Text>
          <ActivityIndicator size="large" />
        </>
      ) : (
        <>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 20, fontSize: 16 }}>
            Verifying authentication...
          </Text>
        </>
      )}
    </View>
  );
}
