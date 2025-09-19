import LottieView from "lottie-react-native";
import { useRef } from "react";

const greenPulse = require("@/assets/lottie/Green Pulse Dot.json");
const redPulse = require("@/assets/lottie/Red Pulsing Dot.json");

interface ConnectivityStatusProps {
  isConnected: boolean;
}

function ConnectivityStatus({ isConnected }: ConnectivityStatusProps) {
  const animation = useRef<LottieView>(null);

  return (
    <LottieView
      autoPlay
      ref={animation}
      style={{
        width: 200,
        height: 200,
      }}
      source={isConnected ? greenPulse : redPulse}
    />
  );
}

export default ConnectivityStatus;
