import { Entypo } from "@expo/vector-icons";
import { ImageBackground } from "expo-image";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Agent, Status } from "@/types";
import AgentService from "./AgentService";
import StatusIcon from "./StatusIcon";

const AgentIcon = require("@/assets/icons/server.png");

interface AgentContainerProps {
  agent: Agent;
}

function AgentContainer({ agent }: AgentContainerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [bodyHeight, setBodyHeight] = useState(0);
  const height = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });

  const toggleExpand = () => {
    height.value = withTiming(isExpanded ? 0 : bodyHeight, { duration: 300 });
    setIsExpanded(!isExpanded);
  };

  const agentStatus = agent.services.reduce<Status>((prev, service) => {
    if (service.last_status === null) return prev;
    const statusOrder = ["ERROR", "FAILURE", "WARNING", "UPDATE", "OK"];
    return statusOrder.indexOf(service.last_status) < statusOrder.indexOf(prev!)
      ? service.last_status
      : prev;
  }, "OK");

  return (
    <View style={styles.wrapper}>
      <Pressable onPress={toggleExpand} style={styles.container}>
        <ImageBackground
          source={AgentIcon}
          style={styles.agentIcon}
          contentFit="contain"
        >
          <StatusIcon status={agentStatus} styles={styles.agentStatusIcon} />
        </ImageBackground>
        <Text style={styles.agentName}>{agent.name}</Text>
        <Entypo
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="#37A9E1"
        />
      </Pressable>
      <Animated.View style={[styles.animatedContainer, animatedStyle]}>
        <View
          style={{ position: "absolute", width: "100%" }}
          onLayout={(event) => {
            setBodyHeight(event.nativeEvent.layout.height);
          }}
        >
          <View style={styles.body}>
            {agent.services.map((service, index) => (
              <AgentService key={index} service={service} />
            ))}

            {/* No services feedback */}
            {agent.services.length === 0 && (
              <Text style={{ color: "#fff" }}>No services found.</Text>
            )}
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#1C2124",
    borderRadius: 10,
    marginBottom: 10,
    overflow: "hidden",
    maxWidth: 900,
    width: "100%",
    alignSelf: "center",
  },
  container: {
    alignItems: "center",
    backgroundColor: "#2F393E",
    borderRadius: 10,
    flexDirection: "row",
    height: 60,
    padding: 10,
    zIndex: 1,
  },
  animatedContainer: {
    overflow: "hidden",
  },
  body: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  agentIcon: {
    width: 40,
    height: 40,
  },
  agentStatusIcon: {
    position: "absolute",
    bottom: 0,
  },
  agentName: {
    flex: 1,
    fontSize: 16,
    marginHorizontal: 10,
    textAlign: "center",
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
  },
});

export default AgentContainer;
