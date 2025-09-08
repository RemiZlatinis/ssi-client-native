import { View, Text, StyleSheet } from "react-native";

import StatusIcon from "./StatusIcon";
import Colors from "@/constants/Colors";
import { Status } from "@/types";

interface ServerServiceProps {
  name: string;
  status: Status;
  lastUpdate: Date;
}

function ServerService({ name, status, lastUpdate }: ServerServiceProps) {
  return (
    <View style={styles.container}>
      <StatusIcon status={status} size={20} />
      <View style={styles.detailContainer}>
        <View style={styles.detailInnerContainer}>
          <Text style={styles.serviceName}>{name}</Text>
          <Text style={styles.serviceLastUpdate}>
            {HumanizeDate(lastUpdate)}
          </Text>
        </View>
        <Text style={styles.serviceMessage}>No errors found.</Text>
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
    color: Colors.server.lastUpdate,
  },
  serviceMessage: {
    fontFamily: "Poppins-Light",
    fontSize: 12,
    color: Colors.server.message,
  },
});

function HumanizeDate(date: Date): string {
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

export default ServerService;
