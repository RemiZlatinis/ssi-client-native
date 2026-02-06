import { Platform } from "react-native";

// Load environment variables
const DEV_WEB_URL = process.env.EXPO_PUBLIC_DEV_WEB_URL;
const BACKEND_URL =
  Platform.OS === "web" && __DEV__ && DEV_WEB_URL
    ? DEV_WEB_URL // We need localhost for web on development
    : process.env.EXPO_PUBLIC_BACKEND_URL;
const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

// Throw an error on missing a required environment variable
if (!BACKEND_URL) throw Error("EXPO_PUBLIC_BACKEND_URL is required!");
if (!GOOGLE_WEB_CLIENT_ID)
  throw Error("EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID is required!");

/**
 * Normalized BACKEND_URL always end with '/'
 */
const BASE_URL = BACKEND_URL.endsWith("/") ? BACKEND_URL : `${BACKEND_URL}/`;

const API_PREFIX = "api/";

// Export configurations
export { API_PREFIX, BASE_URL, GOOGLE_WEB_CLIENT_ID };
