import { useState } from "react";
import { Alert } from "react-native";

import config from "@/config";
import { useAuthContext } from "./AuthContext";
import authStorage from "./authStorage";

function useAuth() {
  const { auth, setAuth } = useAuthContext();
  const [loading, setLoading] = useState(false);

  async function login(username: string, password: string) {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `${config.BACKEND.BASE_URL}${config.BACKEND.LOGIN}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
          // signal: AbortSignal.timeout(5000), // 5 seconds timeout
        },
      );

      const data = await response.json();

      if (!response.ok) {
        // JWT auth errors come in a 'detail' field from DRF
        const message = data.detail || "Invalid username or password.";
        throw new Error(message);
      }

      // Temporarily profile image
      // Backend don't provide user picture yet
      const dataWithProfile = {
        ...data,
        user: {
          ...data.user,
          picture: "https://avatars.githubusercontent.com/u/39838694?v=4",
        },
      };

      await authStorage.storeAuthObject(dataWithProfile);
      setAuth(dataWithProfile);
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
      let errorMessage = error.message;
      // Provide a more user-friendly message for generic network errors
      if (
        error instanceof TypeError &&
        error.message === "Network request failed"
      ) {
        errorMessage =
          "Unable to connect to the server. Please check your network connection or try again later.";
      }

      Alert.alert("Login Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await authStorage.removeAuthObject();
    setAuth(null);
    // TODO: Unregister the device to disable notifications
  }

  async function restoreAuthObject() {
    setLoading(true);
    const authObject = await authStorage.getAuthObject();
    setLoading(false);
    if (authObject) setAuth(authObject);
  }

  return {
    auth,
    setAuth,
    login,
    loading,
    logout,
    restoreAuthObject,
  };
}

export default useAuth;
