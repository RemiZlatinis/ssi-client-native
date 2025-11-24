import { Image, ImageStyle } from "expo-image";
import { ServiceStatus } from "@/types";

const StatusIconMap: Record<Exclude<ServiceStatus, null>, ImageData> = {
  UNKNOWN: require("@/assets/icons/unknown.png"),
  OK: require("@/assets/icons/ok.png"),
  UPDATE: require("@/assets/icons/update.png"),
  WARNING: require("@/assets/icons/warning.png"),
  FAILURE: require("@/assets/icons/failure.png"),
  ERROR: require("@/assets/icons/error.png"),
};

function StatusIcon({
  status,
  size = 18,
  styles,
}: {
  size?: number;
  status: ServiceStatus;
  styles?: ImageStyle;
}) {
  return (
    <Image
      source={StatusIconMap[status]}
      style={[styles, { width: size, height: size }]}
      contentFit="contain"
    />
  );
}

export default StatusIcon;
