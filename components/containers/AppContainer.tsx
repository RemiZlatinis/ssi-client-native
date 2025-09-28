import { useColorScheme, View, ViewProps, ViewStyle } from "react-native";

// Temporarily until the final pallet
const _colors = {
  white: "#fff",
  secondary: "#E8F2F7",
  light: "#84C2E188",
  grey: "#ccc",
};

const _colorsDark = {
  white: "#091620",
  secondary: "#185E81",
  light: "#84C2E188",
  grey: "#ccc",
};

interface AppContainerProps extends ViewProps {
  color?: keyof typeof _colors;
  borderRadius?: number;
  padding?: number;
  margin?: number;
  shadow?: boolean;
}

function AppContainer({
  color = "white",
  borderRadius = 10,
  padding = 20,
  margin = 0,
  shadow = true,
  ...props
}: AppContainerProps) {
  const dark = useColorScheme() === "dark";
  const colors = dark ? _colorsDark : _colors;

  const containerStyle: ViewStyle = {
    backgroundColor: colors[color],
    borderRadius,
    padding,
    margin,
    ...(shadow && {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    }),
  };

  return <View {...props} style={[containerStyle, props.style]} />;
}

export default AppContainer;
