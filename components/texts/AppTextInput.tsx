import {
  TextInput as DefaultTextInput,
  StyleSheet,
  TextInputProps,
  useColorScheme,
  View,
} from "react-native";

interface AppTextInputProps {
  textInputProps: TextInputProps;
}

function TextInput(props: AppTextInputProps) {
  const dark = useColorScheme() === "dark";

  return (
    <View style={[styles.container, dark && styles.containerDark]}>
      <DefaultTextInput
        placeholderTextColor="#84C2E188"
        {...props.textInputProps}
        style={[styles.input, props.textInputProps.style]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#E8F2F7",
    borderRadius: 30,
    height: 60,
    justifyContent: "center",
    width: "100%",
  },
  containerDark: {
    backgroundColor: "#091620",
  },
  input: {
    padding: "auto",
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    textAlign: "center",
    color: "#185E81",
    height: "100%",
    width: "100%",
  },
});

export default TextInput;
