import {
  Alert,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import AppScreen from "@/components/containers/AppScreen";
import ServerContainer from "@/components/servers/ServerContainer";

export default function OverviewScreen() {
  console.log("OverviewScreen");

  return (
    <AppScreen>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerItemContainer} />
        <Text style={styles.header}>Service Status Indicator</Text>
        <View style={styles.headerItemContainer}>
          <Pressable onPress={() => router.push("/modal")}>
            <FontAwesome6 name="user-circle" size={32} color="black" />
          </Pressable>
        </View>
      </View>

      {/* Content */}
      <View style={styles.container}>
        <ServerContainer
          server={{ id: "1", name: "Home Lab - Main Server", status: "OK" }}
        />
        <ServerContainer
          server={{ id: "2", name: "My NAS", status: "UPDATE" }}
        />
        <ServerContainer
          server={{ id: "3", name: "Server Name", status: "ERROR" }}
        />
      </View>

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
  container: {
    flex: 1,
    padding: 15,
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
    fontFamily: "BrunoAce",
    paddingVertical: 16,
  },
  title: { fontSize: 20, fontWeight: "bold" },
  separator: { marginVertical: 30, height: 1, width: "80%" },
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
