import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import Button from "@/components/buttons/AppButton";
import Text from "@/components/texts/AppText";
import { useUser } from "@/hooks";
import api from "@/api";

const menuItems = [
  { id: "1", title: "Profile", icon: "person-outline", route: null },
  {
    id: "2",
    title: "Notifications",
    icon: "notifications-outline",
    route: "/menu/notifications",
  },
  { id: "3", title: "Settings", icon: "settings-outline", route: null },
  {
    id: "4",
    title: "Help & Support",
    icon: "help-circle-outline",
    route: null,
  },
  {
    id: "5",
    title: "About",
    icon: "information-circle-outline",
    route: null,
  },
];

export default function MenuScreen() {
  const { user, setUser } = useUser();

  const handleLogout = () => {
    api.authentication.deauthenticate();
    setUser(null);
  };

  return (
    <>
      <View style={styles.userContainer}>
        <Image style={styles.userPicture} source={user?.picture} />
        <Text size={24} fontWidth="medium">
          {user?.first_name} {user?.last_name}
        </Text>
      </View>

      <FlatList
        data={menuItems}
        contentContainerStyle={styles.menu}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.menuItem,
              item.route === null && styles.menuItemDisabled,
            ]}
            onPress={() => (item.route ? router.push(item.route) : undefined)}
            disabled={item.route === null}
          >
            <Ionicons name={item.icon as any} style={styles.menuItemIcon} />
            <Text size={20}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />

      <Button
        title="Logout"
        onPress={handleLogout}
        style={styles.logoutButton}
      />
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

  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginVertical: 20,
  },
  userPicture: {
    borderColor: "#185E81",
    borderRadius: 50,
    borderWidth: 1,
    height: 48,
    width: 48,
  },

  logoutButton: {
    marginBottom: Platform.OS === "web" ? 20 : 60,
    backgroundColor: "#185E81",
  },
  menu: {
    gap: 30,
    // marginHorizontal: 15,
    marginVertical: 40,
  },
  menuItem: {
    flexDirection: "row",
    gap: 20,
  },
  menuItemDisabled: {
    opacity: 0.3,
  },
  menuItemIcon: {
    fontSize: 28,
    color: "#185E81",
  },
});
