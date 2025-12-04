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
  fontSize?: number;
}

function Button(props: AppButtonProps) {
  return (
    <Pressable
      onPress={props.onPress}
      style={[styles.container, props.disabled && styles.disabled, props.style]}
    >
      <Text style={[styles.title, { fontSize: props.fontSize || 24 }]}>
        {props.title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#37A9E1",
    borderRadius: 30,
    height: Platform.OS === "web" ? 40 : 60,
    justifyContent: "center",
    maxWidth: Platform.OS === "web" ? 300 : undefined,
    width: "100%",
  },
  title: {
    color: "#fff",
    fontFamily: "BrunoAce",
    fontSize: Platform.OS === "web" ? 16 : 24,
    textAlign: "center",
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Button;
