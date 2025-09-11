import { Image } from "expo-image";
import { router } from "expo-router";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Ionicons from "@expo/vector-icons/Ionicons";

import AppScreen from "@/components/containers/AppScreen";
import Button from "@/components/buttons/AppButton";

const menuItems = [
  { id: "1", title: "Profile", icon: "person-outline", route: "/profile" },
  { id: "2", title: "Settings", icon: "settings-outline", route: "/settings" },
  {
    id: "3",
    title: "Help & Support",
    icon: "help-circle-outline",
    route: "/support",
  },
  {
    id: "4",
    title: "About",
    icon: "information-circle-outline",
    route: "/about",
  },
];

export default function ModalScreen() {
  return (
    <AppScreen style={styles.container}>
      <Text style={styles.title}>Menu</Text>
      <EvilIcons
        name="close"
        size={32}
        style={styles.closeButton}
        onPress={() => router.back()}
      />

      <View style={styles.userContainer}>
        <Image
          style={styles.userPicture}
          source="https://avatars.githubusercontent.com/u/39838694?v=4"
        />
        <Text style={styles.username}>Remi Zlatinis</Text>
      </View>
      <View style={styles.separator} />

      {/* Content */}
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push(item.route as `/${string}`)}
          >
            <Ionicons
              name={item.icon as any}
              size={24}
              style={styles.menuItemIcon}
            />
            <Text style={styles.menuItemText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.separator} />

      <Button
        title="Logout"
        onPress={() => router.replace("/welcome")}
        style={styles.logoutButton}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    marginVertical: 20,
    fontSize: 20,
    fontFamily: "BrunoAce",
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    top: (StatusBar.currentHeight || 0) + 15,
    right: 20,
  },

  // User Info
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    justifyContent: "center",
  },
  userPicture: {
    borderColor: "#185E81",
    borderRadius: 50,
    borderWidth: 1,
    height: 64,
    width: 64,
  },
  username: {
    textAlign: "center",
    fontFamily: "Poppins-Medium",
    fontSize: 24,
  },

  separator: {
    marginVertical: 20,
    height: 1,
    backgroundColor: "#185E81",
    alignSelf: "center",
    opacity: 0.2,
    width: "60%",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemIcon: {
    marginRight: 20,
    color: "#185E81",
  },
  menuItemText: {
    fontFamily: "Poppins-Regular",
    fontSize: 18,
    color: "#333",
  },
  logoutButton: {
    marginBottom: 60,
  },
});
