import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, Slot, usePathname } from "expo-router";
import { StatusBar, StyleSheet, useColorScheme, View } from "react-native";

import AppScreen from "@/components/containers/AppScreen";
import Text from "@/components/texts/AppText";

export default function MenuLayout() {
  const dark = useColorScheme() === "dark";
  const pathname = usePathname();

  return (
    <AppScreen style={styles.layout}>
      <View style={styles.header}>
        <View style={styles.headerActionContainer}>
          {pathname !== "/menu" && (
            <MaterialCommunityIcons
              name="arrow-left"
              size={32}
              onPress={() => router.back()}
              color={dark ? "#E8F2F7" : "#185E81"}
            />
          )}
        </View>
        <Text style={styles.title}>Menu</Text>
        <View style={styles.headerActionContainer}>
          <MaterialCommunityIcons
            name="close"
            size={32}
            color={dark ? "#E8F2F7" : "#185E81"}
            onPress={() =>
              pathname === "/menu" ? router.back() : router.dismissTo("/")
            }
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
  headerActionContainer: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontFamily: "BrunoAce",
  },
});
