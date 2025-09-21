const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

if (!BACKEND_URL) throw Error("EXPO_PUBLIC_BACKEND_URL is not defined!");

const BACKEND = {
  BASE_URL: BACKEND_URL,
  LOGIN: "api/auth/login/",
  AGENTS: "api/agents/",
  AGENTS_SSE: "api/sse/agents/",
  AGENT_REGISTRATION: "api/agents/register/complete/",
};

export default {
  BACKEND,
};
