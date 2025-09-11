import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";

interface AppButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
}

function Button(props: AppButtonProps) {
  return (
    <Pressable onPress={props.onPress} style={[styles.container, props.style]}>
      <Text style={styles.title}>{props.title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#37A9E1",
  },
  title: {
    fontFamily: "BrunoAce",
    fontSize: 24,
    textAlign: "center",
  },
});

export default Button;
