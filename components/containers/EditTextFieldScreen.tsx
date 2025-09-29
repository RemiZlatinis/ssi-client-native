import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppScreen from "./AppScreen";
import AppText from "@/components/texts/AppText";

interface EditTextFieldScreenProps {
  initialValue: string;
  onSave: (value: string) => void;
  onCancel: () => void;
  placeholder?: string;
  title?: string;
}

function EditTextFieldScreen({
  initialValue,
  onSave,
  onCancel,
  placeholder = "Enter text",
  title = "Edit",
}: EditTextFieldScreenProps) {
  const [value, setValue] = useState(initialValue);
  const dark = useColorScheme() === "dark";

  const handleSave = () => {
    onSave(value);
  };

  return (
    <AppScreen style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel} style={styles.iconButton}>
            <Ionicons name="close" size={24} color="#185E81" />
          </TouchableOpacity>
          <AppText fontWidth="bold" color="primary" size={18}>
            {title}
          </AppText>
          <TouchableOpacity onPress={handleSave} style={styles.iconButton}>
            <Ionicons name="checkmark" size={24} color="#185E81" />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, dark && styles.inputDark]}
            value={value}
            onChangeText={setValue}
            placeholder={placeholder}
            placeholderTextColor={dark ? "#ccc" : "#666"}
            autoFocus
            multiline
          />
        </View>
      </KeyboardAvoidingView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  iconButton: {
    padding: 10,
  },
  inputContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 15,
    fontSize: 18,
    fontFamily: "Poppins-Regular",
    color: "#091620",
    backgroundColor: "#fff",
    textAlign: "center",
  },
  inputDark: {
    color: "#E8F2F7",
    backgroundColor: "#091620",
  },
});

export default EditTextFieldScreen;
