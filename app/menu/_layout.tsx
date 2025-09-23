import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, Slot } from "expo-router";
import { StatusBar, StyleSheet, Text, View } from "react-native";

import AppScreen from "@/components/containers/AppScreen";

export default function MenuLayout() {
  return (
    <AppScreen style={styles.layout}>
      <View style={styles.header}>
        <View style={styles.headerActionContainer}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={32}
            style={styles.actionButton}
            onPress={() => router.back()}
          />
        </View>
        <Text style={styles.title}>Menu</Text>
        <View style={styles.headerActionContainer}>
          <MaterialCommunityIcons
            name="close"
            size={32}
            style={styles.actionButton}
            onPress={() => router.push("/")}
          />
        </View>
      </View>

      <Slot />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  layout: {
    paddingTop: StatusBar.currentHeight,
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  headerActionContainer: {},
  actionButton: {
    fontSize: 32,
    color: "#E8F2F7",
  },
  title: {
    fontSize: 24,
    fontFamily: "BrunoAce",
    color: "#E8F2F7",
  },
});
