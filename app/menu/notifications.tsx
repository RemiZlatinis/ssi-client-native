import { StyleSheet, Text, View } from "react-native";

function NotificationsSettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>Notifications Settings Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#185E81",
  },
});

export default NotificationsSettingsScreen;
