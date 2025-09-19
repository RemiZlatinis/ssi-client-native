import { Entypo } from "@expo/vector-icons";
import { ImageBackground } from "expo-image";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Agent, ServiceStatus } from "@/types";
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

  useEffect(() => {
    if (isExpanded) {
      height.value = withTiming(bodyHeight, { duration: 300 });
    }
  }, [height, bodyHeight, isExpanded]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });

  const toggleExpand = () => {
    height.value = withTiming(isExpanded ? 0 : bodyHeight, { duration: 300 });
    setIsExpanded(!isExpanded);
  };

  const agentStatus = useMemo<ServiceStatus>(() => {
    const statusOrder: ServiceStatus[] = [
      "ERROR",
      "FAILURE",
      "WARNING",
      "UPDATE",
      "OK",
    ];
    return agent.services.reduce<ServiceStatus>((prev, service) => {
      if (service.last_status === null) return prev;
      if (prev === null) return service.last_status;
      return statusOrder.indexOf(service.last_status) <
        statusOrder.indexOf(prev)
        ? service.last_status
        : prev;
    }, "OK");
  }, [agent.services]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Pressable
          onPress={toggleExpand}
          onLongPress={() =>
            router.push({
              pathname: "/edit",
              params: { id: agent.id, name: agent.name },
            })
          }
          style={styles.mainContent}
        >
          <ImageBackground
            source={AgentIcon}
            style={styles.agentIcon}
            contentFit="contain"
          >
            {agent.is_online && (
              <StatusIcon
                status={agentStatus}
                styles={styles.agentStatusIcon}
              />
            )}
          </ImageBackground>
          <View style={{ flex: 1 }}>
            <Text style={styles.agentName}>{agent.name}</Text>

            <Text
              style={
                agent.is_online
                  ? styles.onlineStatusText
                  : styles.offlineStatusText
              }
            >
              {agent.is_online ? "Online" : "Offline"}
            </Text>
          </View>
        </Pressable>

        <Pressable onPress={toggleExpand}>
          <Entypo
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color="#37A9E1"
          />
        </Pressable>
      </View>
      <Animated.View style={[styles.animatedContainer, animatedStyle]}>
        <View
          style={{ position: "absolute", width: "100%" }}
          onLayout={(event) => {
            const newHeight = event.nativeEvent.layout.height;
            setBodyHeight(newHeight);
          }}
        >
          <View style={styles.body}>
            {agent.services.map((service) => (
              <AgentService key={service.id} service={service} />
            ))}

            {/* No services feedback */}
            {agent.services.length === 0 && (
              <Text style={styles.noServicesText}>No services found.</Text>
            )}
          </View>
          {agent.ip_address && (
            <Text style={styles.ipAddress}>{agent.ip_address}</Text>
          )}
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
  mainContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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
    textAlign: "center",
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
  },
  onlineStatusText: {
    textAlign: "center",
    fontSize: 12,
    color: "#84e1aeff",
  },
  offlineStatusText: {
    color: "#e18484ff",
    fontSize: 12,
    textAlign: "center",
  },
  ipAddress: {
    padding: 5,
    fontSize: 14,
    color: "#ffffffce",
    textAlign: "center",
    fontWeight: "300",
    backgroundColor: "#185e8180",
  },
  noServicesText: {
    color: "#fff",
    margin: 20,
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Poppins-Light",
  },
});

export default AgentContainer;
