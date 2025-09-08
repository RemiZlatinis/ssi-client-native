import { ImageBackground, StyleSheet, Text, View } from "react-native";

import { Server } from "@/types";
import { Entypo } from "@expo/vector-icons";
import StatusIcon from "./StatusIcon";

const ServerIcon = require("@/assets/icons/server.png");

interface ServerContainerProps {
  server: Server;
}

function ServerContainer({ server }: ServerContainerProps) {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={ServerIcon}
        style={styles.serverIcon}
        resizeMode="contain"
      >
        <StatusIcon status={server.status} />
      </ImageBackground>
      <Text style={styles.serverName}>{server.name}</Text>
      <Entypo name="chevron-down" size={20} color="#37A9E1" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 60,
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#2F393E",
    alignItems: "center",
  },
  serverIcon: {
    width: 40,
    height: 40,
  },
  serverName: {
    flex: 1,
    fontSize: 16,
    marginHorizontal: 10,
    textAlign: "center",
    fontFamily: "Poppins-Medium",
  },
});

export default ServerContainer;
