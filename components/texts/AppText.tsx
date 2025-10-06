import { Text as DefaultText, TextProps, useColorScheme } from "react-native";

// Temporarily until the final pallet
const _colors = {
  primary: "#185E81",
  secondary: "#E8F2F7",
  dark: "#091620",
  light: "#84C2E188",
  grey: "#ccc",
  white: "#fff",
  black: "#000",
};

const _colorsDark = {
  primary: "#E8F2F7",
  secondary: "#185E81",
  dark: "#84C2E188",
  light: "#091620",
  grey: "#ccc",
  white: "#fff",
  black: "#000",
};

interface AppTextProps extends TextProps {
  fontWidth?:
    | "thin"
    | "extralight"
    | "light"
    | "normal"
    | "medium"
    | "semibold"
    | "bold"
    | "extrabold"
    | "black";
  color?: keyof typeof _colors;
  size?: number;
  align?: "auto" | "center" | "justify" | "left" | "right";
}

function Text({
  fontWidth = "normal",
  color = "primary",
  size = 20,
  align = "auto",
  ...props
}: AppTextProps) {
  const dark = useColorScheme() === "dark";
  const colors = dark ? _colorsDark : _colors;
  return (
    <DefaultText
      {...props}
      style={[
        {
          fontFamily: `Poppins-${fontWidth}`,
          fontSize: size,
          color: colors[color],
          textAlign: align,
        },
        props.style,
      ]}
    />
  );
}

export default Text;
