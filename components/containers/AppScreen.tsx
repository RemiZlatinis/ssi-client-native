import { StyleSheet, useColorScheme, View, ViewProps } from "react-native";

function AppScreen(props: ViewProps) {
  const dark = useColorScheme() === "dark";

  return (
    <View style={[styles.container, dark && styles.containerDark]} {...props} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8f2f7",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  containerDark: {
    backgroundColor: "#091620",
  },
});

export default AppScreen;
