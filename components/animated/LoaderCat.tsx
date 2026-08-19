import LottieView from "lottie-react-native";
import { useRef } from "react";

const loaderCat = require("@/assets/lottie/Mufasa-Darker.json");

function LoaderCat() {
  const animation = useRef<LottieView>(null);

  return (
    <LottieView
      autoPlay
      loop
      ref={animation}
      webStyle={{
        width: 400,
      }}
      style={{
        width: 200,
        height: 200,
      }}
      source={loaderCat}
    />
  );
}

export default LoaderCat;
