const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

if (!BACKEND_URL) throw Error("EXPO_PUBLIC_BACKEND_URL is not defined!");

const BACKEND = {
  BASE_URL: BACKEND_URL,
  LOGIN: "api/auth/login/",
  GOOGLE_LOGIN: "api/auth/google/",
  AGENTS: "api/agents/",
  AGENTS_SSE: "api/sse/agents/",
  AGENT_REGISTRATION: "api/agents/register/complete/",
  NOTIFICATIONS_DEVICES: "api/notifications/devices/",
};

const GOOGLE = {
  WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
};

if (!GOOGLE.WEB_CLIENT_ID)
  throw Error(
    "EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID is not defined or google-services.json is missing!",
  );

export default {
  BACKEND,
  GOOGLE,
};
