import { create } from "apisauce";
import { Platform } from "react-native";

import { API_PREFIX, BASE_URL } from "@/config";

import { getCSRFfromCookies } from "./csrf";

const client = create({
  baseURL: BASE_URL + API_PREFIX,
  withCredentials: Platform.OS === "web",
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
});

// Add a request interceptor to manually inject the CSRF token
// We use axiosInstance.interceptors.request because it supports async operations
client.axiosInstance.interceptors.request.use(async (config) => {
  if (Platform.OS === "web" && typeof document !== "undefined") {
    // Only fetch for mutating requests to avoid unnecessary overhead on GETs
    const isMutation = ["post", "put", "delete", "patch"].includes(
      config.method?.toLowerCase() || "",
    );

    let token: string | null = null;

    if (isMutation) {
      token = await getCSRFfromCookies();
    }

    if (token) {
      config.headers["X-CSRFToken"] = token;
    }
  }
  return config;
});

export default client;
