import { Image as ExpoImage } from "expo-image";
import type { CSSProperties } from "react";
import {
  Platform,
  StyleSheet,
  type ImageStyle,
  type StyleProp,
} from "react-native";

type UserAvatarImageProps = {
  picture?: string | null;
  style: StyleProp<ImageStyle>;
};

/**
 * The user's profile picture.
 *
 * On web the avatar is served from Google's content CDN
 * (lh3.googleusercontent.com), which rate-limits (429) requests carrying a
 * Referer from a localhost page (how the app is reached during development
 * through the SSH tunnel). A plain <img> lets us set referrerPolicy
 * per-element; expo-image does not expose it.
 */
export default function UserAvatarImage({
  picture,
  style,
}: UserAvatarImageProps) {
  if (!picture) {
    return null;
  }

  if (Platform.OS === "web") {
    return (
      <img
        alt=""
        referrerPolicy="no-referrer"
        src={picture}
        style={StyleSheet.flatten(style) as CSSProperties}
      />
    );
  }

  return <ExpoImage style={style} source={picture} />;
}
