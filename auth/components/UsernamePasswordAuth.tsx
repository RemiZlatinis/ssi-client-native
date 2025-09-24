import useAuth from "@/auth/useAuth";
import Button from "@/components/buttons/AppButton";
import TextInput from "@/components/texts/AppTextInput";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";

function UsernamePasswordAuth() {
  const { login, loading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={{ width: "100%", gap: 10 }}>
        <TextInput
          textInputProps={{
            placeholder: "Username",
            textContentType: "username",
            autoCapitalize: "none",
            value: username,
            onChangeText: setUsername,
          }}
        />
        <TextInput
          textInputProps={{
            placeholder: "Password",
            secureTextEntry: true,
            textContentType: "password",
            autoCapitalize: "none",
            value: password,
            onChangeText: setPassword,
          }}
        />
      </View>
      <Button
        title={loading ? "Logging in..." : "Login"}
        onPress={() => login(username, password)}
        disabled={loading}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
});

export default UsernamePasswordAuth;
