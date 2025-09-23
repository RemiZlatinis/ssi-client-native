import { router } from "expo-router";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Button from "@/components/buttons/AppButton";
import { Image } from "expo-image";
import useAuth from "@/auth/useAuth";

const menuItems = [
  { id: "1", title: "Profile", icon: "person-outline", route: "/profile" },
  {
    id: "2",
    title: "Notifications",
    icon: "notifications-outline",
    route: "/menu/notifications",
  },
  { id: "3", title: "Settings", icon: "settings-outline", route: "/settings" },
  {
    id: "4",
    title: "Help & Support",
    icon: "help-circle-outline",
    route: "/support",
  },
  {
    id: "5",
    title: "About",
    icon: "information-circle-outline",
    route: "/about",
  },
];

export default function MenuScreen() {
  const { auth, logout } = useAuth();

  return (
    <>
      <View style={styles.userContainer}>
        <Image style={styles.userPicture} source={auth?.user?.picture} />
        <Text style={styles.username}>
          {auth?.user?.first_name} {auth?.user?.last_name}
        </Text>
      </View>

      <View style={styles.separator} />

      <FlatList
        data={menuItems}
        contentContainerStyle={styles.menu}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push(item.route as `/${string}`)}
          >
            <Ionicons name={item.icon as any} style={styles.menuItemIcon} />
            <Text style={styles.menuItemText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.separator} />

      <Button title="Logout" onPress={logout} style={styles.logoutButton} />
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    marginVertical: 20,
    fontSize: 20,
    fontFamily: "BrunoAce",
    textAlign: "center",
    color: "#E8F2F7",
  },
  closeButton: {
    position: "absolute",
    top: (StatusBar.currentHeight || 0) + 15,
    right: 20,
    color: "#E8F2F7",
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
    color: "#E8F2F7",
  },

  separator: {
    marginVertical: 20,
    height: 1,
    backgroundColor: "#185E81",
    alignSelf: "center",
    opacity: 0.2,
    width: "60%",
  },
  logoutButton: {
    marginBottom: 60,
  },
  menu: {
    gap: 40,
    marginHorizontal: "auto",
    marginVertical: 20,
  },
  menuItem: {
    flexDirection: "row",
    gap: 20,
  },
  menuItemIcon: {
    fontSize: 28,
    color: "#185E81",
  },
  menuItemText: {
    fontFamily: "Poppins",
    fontSize: 20,
    color: "#E8F2F7",
    marginBottom: -4,
  },
});
