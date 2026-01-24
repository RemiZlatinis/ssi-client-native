// Load environment variables
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
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
