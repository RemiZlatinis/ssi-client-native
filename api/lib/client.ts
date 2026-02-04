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

// Add a request transform to manually inject the CSRF token
// This is more robust than relying on axios defaults, especially for cross-origin localhost requests
client.addRequestTransform((request) => {
  if (Platform.OS === "web" && typeof document !== "undefined") {
    const token = getCSRFfromCookies(document);
    if (token) {
      if (!request.headers) {
        request.headers = {};
      }
      request.headers["X-CSRFToken"] = token;
    }
  }
});

export default client;
