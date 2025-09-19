import { StyleSheet, Text, View } from "react-native";

import Colors from "@/constants/Colors";
import { AgentService as AgentServiceType } from "@/types";
import StatusIcon from "./StatusIcon";

interface AgentServiceProps {
  service: AgentServiceType;
}

function AgentService({ service }: AgentServiceProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <StatusIcon status={service.last_status} />
      </View>
      <View style={styles.detailContainer}>
        <View style={styles.detailInnerContainer}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <Text style={styles.serviceLastUpdate}>
            {HumanizeDate(service.last_seen)}
          </Text>
        </View>
        {service.last_message && (
          <Text style={styles.serviceMessage}>{service.last_message}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    // width: 40,
  },
  detailContainer: {
    flex: 1,
    marginLeft: 10,
  },
  detailInnerContainer: {
    maxHeight: 20,
    flexDirection: "row",
    alignItems: "baseline",
  },
  serviceName: {
    fontFamily: "Poppins",
    fontSize: 14,
    color: Colors.text,
  },
  serviceLastUpdate: {
    marginLeft: 5,
    fontFamily: "Poppins-Light",
    fontSize: 12,
    color: Colors.agent.lastUpdate,
  },
  serviceMessage: {
    fontFamily: "Poppins-Light",
    fontSize: 12,
    color: Colors.agent.message,
  },
});

function HumanizeDate(date?: Date): string {
  if (!date) return "Never";

  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) {
    return "Just now";
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? "s" : ""} ago`;
}

export default AgentService;
