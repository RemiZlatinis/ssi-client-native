import { Image, ImageStyle } from "react-native";

import { Status } from "@/types";

const StatusIconMap: Record<Exclude<Status, null>, ImageData> = {
  OK: require("@/assets/icons/ok.png"),
  UPDATE: require("@/assets/icons/update.png"),
  WARNING: require("@/assets/icons/warning.png"),
  FAILURE: require("@/assets/icons/failure.png"),
  ERROR: require("@/assets/icons/error.png"),
};

function StatusIcon({
  status,
  size = 24,
  styles,
}: {
  size?: number;
  status: Status;
  styles?: ImageStyle;
}) {
  if (status === null) return null;

  return (
    <Image
      source={StatusIconMap[status]}
      style={[styles, { width: size, height: size }]}
      resizeMode="contain"
    />
  );
}

export default StatusIcon;
