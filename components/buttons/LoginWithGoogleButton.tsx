import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, useColorScheme } from "react-native";

import api from "@/api";
import { useUser } from "@/contexts/UserContext";

function LoginWithGoogleButton() {
  const dark = useColorScheme() === "dark";
  const { setLoading, setUser } = useUser();

  const login = async () => {
    setLoading(true);
    const user = await api.authentication.loginWithGoogle();
    if (user) setUser(user);
    setLoading(false);
  };

  return (
    <Pressable
      style={[styles.container, dark && styles.containerDark]}
      onPress={login}
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
