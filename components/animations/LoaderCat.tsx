import LottieView from "lottie-react-native";
import { useRef } from "react";

const loaderCat = require("@/assets/lottie/Loader cat.json");

function LoaderCat() {
  const animation = useRef<LottieView>(null);

  return (
    <LottieView
      autoPlay
      ref={animation}
      style={{
        width: 200,
        height: 200,
      }}
      source={loaderCat}
    />
  );
}

export default LoaderCat;
