import * as Poppins from "@expo-google-fonts/poppins";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";

const POPPINS_MAPPING = {
  "Poppins-thin": Poppins.Poppins_100Thin,
  "Poppins-extralight": Poppins.Poppins_200ExtraLight,
  "Poppins-light": Poppins.Poppins_300Light,
  "Poppins": Poppins.Poppins_400Regular,
  "Poppins-normal": Poppins.Poppins_400Regular,
  "Poppins-medium": Poppins.Poppins_500Medium,
  "Poppins-semibold": Poppins.Poppins_600SemiBold,
  "Poppins-bold": Poppins.Poppins_700Bold,
  "Poppins-extrabold": Poppins.Poppins_800ExtraBold,
  "Poppins-black": Poppins.Poppins_900Black,
};

/**
 * Loads the application fonts
 *
 * @return
 * - loaded (boolean) - A boolean to detect if the font for fontFamily has finished loading.
 * - error (Error | null) - An error encountered when loading the fonts.
 */
export function useAppFonts() {
  return useFonts({
    BrunoAce: require("../assets/fonts/BrunoAce-Regular.ttf"),
    ...POPPINS_MAPPING,
    ...FontAwesome.font,
  });
}
