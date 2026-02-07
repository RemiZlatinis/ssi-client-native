import { Image } from "expo-image";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
} from "react-native";

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
    width: Platform.OS === "web" ? "auto" : "100%",
    alignSelf: "center",
    height: 60,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    gap: 20,
  },
  containerDark: {
    backgroundColor: "#091620",
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
  },
  titleDark: { color: "#e8f2f7ee" },
  icon: { width: 20, height: 20 },
});

export default LoginWithGoogleButton;
