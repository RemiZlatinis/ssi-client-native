import {
  ButtonProps,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";

interface AppButtonProps extends ButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
}

function Button(props: AppButtonProps) {
  return (
    <Pressable
      onPress={props.onPress}
      style={[styles.container, props.disabled && styles.disabled, props.style]}
    >
      <Text style={styles.title}>{props.title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#37A9E1",
    borderRadius: 30,
    height: 60,
    justifyContent: "center",
    maxWidth: Platform.OS === "web" ? 300 : undefined,
    width: "100%",
  },
  title: {
    color: "#fff",
    fontFamily: "BrunoAce",
    fontSize: 24,
    textAlign: "center",
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Button;
