import { StyleSheet, useColorScheme, View, ViewProps } from "react-native";

function AppScreen(props: ViewProps) {
  const dark = useColorScheme() === "dark";

  return (
    <View
      {...props}
      style={[styles.container, dark && styles.containerDark, props.style]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#84C2E1",
  },
  containerDark: {
    backgroundColor: "#091620",
  },
});

export default AppScreen;
