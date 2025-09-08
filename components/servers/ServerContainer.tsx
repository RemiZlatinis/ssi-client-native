import { useState } from "react";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Server } from "@/types";
import { Entypo } from "@expo/vector-icons";
import ServerService from "./ServerService";
import StatusIcon from "./StatusIcon";

const ServerIcon = require("@/assets/icons/server.png");

interface ServerContainerProps {
  server: Server;
}

function ServerContainer({ server }: ServerContainerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.wrapper}>
      <Pressable onPress={toggleExpand} style={styles.container}>
        <ImageBackground
          source={ServerIcon}
          style={styles.serverIcon}
          resizeMode="contain"
        >
          <StatusIcon status={server.status} styles={styles.serverStatusIcon} />
        </ImageBackground>
        <Text style={styles.serverName}>{server.name}</Text>
        <Entypo
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="#37A9E1"
        />
      </Pressable>
      {isExpanded && (
        <View style={styles.body}>
          <ServerService
            name="Uptime"
            status="OK"
            lastUpdate={new Date(Date.now() - 1000 * 30)}
          />
          <ServerService
            name="CPU Usage"
            status="UPDATE"
            lastUpdate={new Date(Date.now() - 1000 * 60 * 5)}
          />
          <ServerService
            name="Memory"
            status="ERROR"
            lastUpdate={new Date(Date.now() - 1000 * 60 * 60 * 2)}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#1C2124",
    borderRadius: 10,
    marginBottom: 10,
    overflow: "hidden",
  },
  container: {
    alignItems: "center",
    backgroundColor: "#2F393E",
    borderRadius: 10,
    flexDirection: "row",
    height: 60,
    padding: 10,
  },
  body: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  serverIcon: {
    width: 40,
    height: 40,
  },
  serverStatusIcon: {
    position: "absolute",
    bottom: 0,
  },
  serverName: {
    flex: 1,
    fontSize: 16,
    marginHorizontal: 10,
    textAlign: "center",
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
  },
});

export default ServerContainer;
