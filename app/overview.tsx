import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";

export default function OverviewScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerItemContainer} />
        <Text style={styles.header}>Service Status Indicator</Text>
        <View style={styles.headerItemContainer}>
          <Pressable onPress={() => router.push("/modal")}>
            <FontAwesome6 name="user-circle" size={24} color="black" />
          </Pressable>
        </View>
      </View>

      {/* Content */}
      <Text style={styles.title}>Overview</Text>
      <View style={styles.separator} />
      <Text>This is your main application overview screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "#185E81",
    alignItems: "center",
    justifyContent: "space-around",
  },
  headerItemContainer: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#185E81",
  },
  header: {
    fontSize: 16,
    fontFamily: "BrunoAce",
    paddingVertical: 16,
  },
  title: { fontSize: 20, fontWeight: "bold" },
  separator: { marginVertical: 30, height: 1, width: "80%" },
});
