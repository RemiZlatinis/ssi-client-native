import { StyleSheet, View } from "react-native";

import Colors from "@/constants/Colors";
import { Service } from "@/types";
import StatusIcon from "./StatusIcon";
import Text from "../texts/AppText";
import { HumanizeDate } from "@/utils/date";

interface AgentServiceProps {
  service: Service;
}

function AgentService({ service }: AgentServiceProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <StatusIcon status={service.last_status} />
      </View>
      <View style={styles.detailContainer}>
        <View style={styles.detailInnerContainer}>
          <Text size={14} fontWidth="medium">
            {service.name}
          </Text>
          <Text style={styles.serviceLastUpdate}>
            {HumanizeDate(service.last_seen || undefined)}
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

export default AgentService;
