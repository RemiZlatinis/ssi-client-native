import { FontAwesome6 } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { FlatList, StatusBar, StyleSheet, Text, View } from "react-native";

import useAuth from "@/auth/useAuth";
import { useAgents } from "@/contexts/AgentsContext";
import AgentContainer from "@/components/agents/AgentContainer";
import ConnectivityStatus from "@/components/animations/ConnectivityStatus";
import AppScreen from "@/components/containers/AppScreen";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useNetwork } from "@/hooks";

function OverviewScreen() {
  const { auth } = useAuth();
  const { agents, isConnected } = useAgents();
  const { isConnected: isNetworkConnected, isInternetReachable } = useNetwork();
  usePushNotifications();

  return (
    <AppScreen>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerItemContainer}>
          <ConnectivityStatus isConnected={isConnected} />
        </View>
        <Text style={styles.header}>Service Status Indicator</Text>
        <View style={styles.headerItemContainer}>
          <Link href="/menu">
            {auth?.user?.picture ? (
              <Image style={styles.userPicture} source={auth.user.picture} />
            ) : (
              <FontAwesome6 name="user-circle" size={32} color="#fff" />
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
      <Link href="/add" style={styles.actionButton}>
        <View style={styles.actionButton}>
          <FontAwesome6 name="plus" size={24} color="#84C2E1" />
        </View>
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
  userPicture: {
    borderColor: "#84C2E1",
    borderRadius: 20,
    borderWidth: 1,
    height: 32,
    width: 32,
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
