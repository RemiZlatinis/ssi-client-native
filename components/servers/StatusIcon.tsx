import { Image, StyleSheet } from "react-native";

import { Status } from "@/types";

const StatusIconMap: Record<Exclude<Status, null>, ImageData> = {
  OK: require("@/assets/icons/ok.png"),
  UPDATE: require("@/assets/icons/update.png"),
  WARNING: require("@/assets/icons/warning.png"),
  FAILURE: require("@/assets/icons/failure.png"),
  ERROR: require("@/assets/icons/error.png"),
};

function StatusIcon({ status, size = 24 }: { status: Status; size?: number }) {
  if (status === null) return null;

  return (
    <Image
      source={StatusIconMap[status]}
      style={[styles.icon, { width: size, height: size }]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  icon: {
    position: "absolute",
    bottom: 0,
  },
});

export default StatusIcon;
