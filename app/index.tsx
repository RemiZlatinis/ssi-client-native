import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Alert,
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import AppScreen from "@/components/containers/AppScreen";
import ServerContainer from "@/components/servers/ServerContainer";
import { Server } from "@/types";

export default function OverviewScreen() {
  const servers: Server[] = [
    { id: "1", name: "Home Lab - Main Server", status: "OK" },
    { id: "2", name: "My NAS", status: "UPDATE" },
    { id: "3", name: "Node 1", status: "ERROR" },
    { id: "4", name: "Node 2", status: "ERROR" },
  ];

  return (
    <AppScreen>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerItemContainer} />
        <Text style={styles.header}>Service Status Indicator</Text>
        <View style={styles.headerItemContainer}>
          <Pressable onPress={() => router.push("/menu")}>
            <FontAwesome6 name="user-circle" size={32} color="#fff" />
          </Pressable>
        </View>
      </View>

      {/* Content */}
      <FlatList
        data={servers}
        style={styles.list}
        contentContainerStyle={styles.listContentContainer}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ServerContainer server={item} />}
      />

      {/* Action Button */}
      <Pressable
        style={styles.actionButton}
        onPress={() =>
          Alert.alert(
            "Register new Agent",
            "You cannot not register new Agent. (Yet)"
          )
        }
      >
        <FontAwesome6 name="plus" size={24} color="#84C2E1" />
      </Pressable>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1, // This makes the FlatList take up the remaining screen space
  },
  listContentContainer: {
    padding: 15,
    paddingBottom: 60,
  },
  headerContainer: {
    paddingHorizontal: 15,
    flexDirection: "row",
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "#185E81",
    alignItems: "center",
    justifyContent: "space-between",
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
    color: "#fff",
    fontFamily: "BrunoAce",
    paddingVertical: 16,
  },
  actionButton: {
    position: "absolute",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 2,
    },
    bottom: 60,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#185E81",
    alignItems: "center",
    justifyContent: "center",
  },
});
