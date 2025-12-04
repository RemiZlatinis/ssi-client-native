import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { Image } from "expo-image";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, useColorScheme } from "react-native";

import config from "@/config";
import { AuthObject } from "@/types";
import useAuth from "../useAuth";
import authStorage from "../authStorage";

WebBrowser.maybeCompleteAuthSession();

function LoginWithGoogleButton() {
  const { setLoading, setAuth } = useAuth();
  const dark = useColorScheme() === "dark";

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: config.GOOGLE.WEB_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === "success" && response.authentication?.accessToken) {
      handleLogin(response.authentication.accessToken);
    } else if (response?.type === "error") {
      alert("Google Login Error: " + response.error?.message);
    }
  }, [response]);

  const handleLogin = async (accessToken: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${config.BACKEND.BASE_URL}${config.BACKEND.GOOGLE_LOGIN}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_token: accessToken,
          }),
        },
      );

      if (response.status === 200) {
        // Successful login
        const auth = (await response.json()) as AuthObject;
        await authStorage.storeAuthObject(auth);
        setAuth(auth);
      } else {
        const errorData = await response.json();
        alert("Login failed: " + (errorData.detail || "Unknown error"));
      }
    } catch (error: any) {
      alert("Login Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable
      disabled={!request}
      style={[
        styles.container,
        dark && styles.containerDark,
        !request && { opacity: 0.5 },
      ]}
      onPress={() => {
        promptAsync();
      }}
    >
      <Image
        source={require("@/assets/images/google.png")}
        style={styles.icon}
      />
      <Text style={[styles.title, dark && styles.titleDark]}>
        Login with Google
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 60,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 30,
    cursor: "pointer", // Add cursor pointer for web
  },
  containerDark: {
    backgroundColor: "#091620",
  },
  title: { fontWeight: "bold", fontSize: 20, marginLeft: 20 },
  titleDark: { color: "#e8f2f7ee" },
  icon: { width: 20, height: 20, marginHorizontal: 20 },
});

export default LoginWithGoogleButton;
