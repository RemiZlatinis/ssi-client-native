import { FontAwesome6 } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link } from "expo-router";
import {
  FlatList,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import AgentContainer from "@/components/agents/AgentContainer";
import AppScreen from "@/components/containers/AppScreen";

import ConnectivityStatus from "@/components/animations/ConnectivityStatus";
import {
  useAgents,
  useNetworkState,
  usePushNotifications,
  useUser,
} from "@/hooks";

function OverviewScreen() {
  const { user } = useUser();
  const { agents, isConnected, reconnect } = useAgents();
  const { isConnected: isNetworkConnected, isInternetReachable } =
    useNetworkState();
  usePushNotifications();

  return (
    <AppScreen>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerItemContainer}>
          <Pressable onLongPress={reconnect}>
            <ConnectivityStatus isConnected={isConnected} />
          </Pressable>
        </View>
        <Text style={styles.header}>Service Status Indicator</Text>
        <View style={styles.headerItemContainer}>
          <Link href="/menu" style={styles.linkContainer}>
            {user?.picture ? (
              <Image style={styles.userPicture} source={user.picture} />
            ) : (
              <FontAwesome6
                name="user-circle"
                size={Platform.OS === "web" ? 40 : 32}
                color="#fff"
              />
            )}
          </Link>
        </View>
      </View>

      {/* Content */}
      {isConnected ? (
        agents.length === 0 ? (
          <NoAgentsMessage />
        ) : (
          <FlatList
            data={agents}
            style={styles.list}
            contentContainerStyle={styles.listContentContainer}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <AgentContainer agent={item} />}
          />
        )
      ) : !isNetworkConnected ? (
        <DisconnectedMessage message="You are offline (WiFi or mobile data)" />
      ) : !isInternetReachable ? (
        <DisconnectedMessage message="You are offline (Internet is unreachable)" />
      ) : (
        <DisconnectedMessage />
      )}

      {/* Action Button */}
      <Link href="/add" style={styles.actionButtonLinkContainer}>
        <FontAwesome6 name="plus" size={24} color="#84C2E1" />
      </Link>
    </AppScreen>
  );
}

function DisconnectedMessage({
  message = "Disconnected from the server",
}: {
  message?: string;
}) {
  return (
    <View style={styles.screenMessageContainer}>
      <Text style={styles.disconnectedMessage}>{message}</Text>
    </View>
  );
}

function NoAgentsMessage() {
  return (
    <View style={styles.screenMessageContainer}>
      <Text style={styles.noAgentsMessage}>
        There are no agents registered with your account.
      </Text>
      <Text style={styles.noAgentsMessage2}>
        Install the Service Status Indicator Agent on your Linux machine and use
        the CLI to register your agent.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1, // This makes the FlatList take up the remaining screen space
  },
  listContentContainer: {
    padding: 15,
  },
  headerContainer: {
    paddingHorizontal: 10,
    flexDirection: "row",
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "#185E81",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50 + (StatusBar.currentHeight || 0),
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
  },
  linkContainer: {
    // The Link (<a>)  must displayed as flex to occupy space
    // and apply centering to its children on the web platform
    display: "flex",
  },
  userPicture: {
    borderColor: "#84C2E1",
    borderRadius: 20,
    borderWidth: 1,
    height: Platform.OS === "web" ? 40 : 32,
    width: Platform.OS === "web" ? 40 : 32,
  },
  actionButtonLinkContainer: {
    alignItems: "center",
    backgroundColor: "#185E81",
    borderRadius: 30,
    bottom: Platform.OS === "web" ? 20 : 60,
    display: "flex", // The Link (<a>)  must displayed as flex to occupy space
    elevation: 4,
    height: 60,
    justifyContent: "center",
    position: "absolute",
    right: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 2,
    },
    textAlign: "center", // The plus icon handled as font non-web platforms
    textAlignVertical: "center", // That's why we use text properties to align the icon
    width: 60,
  },
  screenMessageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    bottom: StatusBar.currentHeight || 0, // Screen centered by removes the bar difference
  },
  disconnectedMessage: {
    color: "#e13759ff",
    fontFamily: "Poppins-ExtraLight",
    fontSize: 16,
  },
  noAgentsMessage: {
    padding: 20,
    textAlign: "center",
    color: "#84C2E1",
    fontFamily: "Poppins",
    fontSize: 16,
  },
  noAgentsMessage2: {
    paddingHorizontal: 20,
    textAlign: "center",
    color: "#84C2E180",
    fontFamily: "Poppins-ExtraLight",
    fontSize: 14,
  },
});

export default OverviewScreen;
