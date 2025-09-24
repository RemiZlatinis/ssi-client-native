import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { Image } from "expo-image";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, useColorScheme } from "react-native";

import config from "@/config";
import { AuthObject } from "@/types";
import useAuth from "../useAuth";
import authStorage from "../authStorage";

function LoginWithGoogleButton() {
  const { setLoading, setAuth } = useAuth();
  const dark = useColorScheme() === "dark";

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: config.GOOGLE.WEB_CLIENT_ID,
      offlineAccess: true,
    });
  }, []);

  const signInAsync = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const authCode = userInfo.data?.serverAuthCode;
      if (authCode) {
        // Exchange the authCode for AuthObject
        const response = await fetch(
          `${config.BACKEND.BASE_URL}${config.BACKEND.GOOGLE_LOGIN}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              code: authCode,
            }),
          },
        );
        if (response.status === 200) {
          // Successful login
          const auth = (await response.json()) as AuthObject;
          await authStorage.storeAuthObject(auth);
          setAuth(auth);
        }
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        alert("User cancelled the login flow");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert("Sign in is in progress");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert("Play services not available or outdated");
      } else {
        alert("login: Error:" + error.message);
      }
    }
    setLoading(false);
  };

  return (
    <Pressable
      style={[styles.container, dark && styles.containerDark]}
      onPress={signInAsync}
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
  },
  containerDark: {
    backgroundColor: "#091620",
  },
  title: { fontWeight: "bold", fontSize: 20, marginLeft: 20 },
  titleDark: { color: "#e8f2f7ee" },
  icon: { width: 20, height: 20, marginHorizontal: 20 },
});

export default LoginWithGoogleButton;
