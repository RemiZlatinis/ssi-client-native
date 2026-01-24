import { Platform } from "react-native";
import EventSource from "react-native-sse";

import { API_PREFIX, BASE_URL } from "@/config";
import secureStorage from "@/services/secureStorage";

export interface SSEConnectionOptions {
  onOpen: () => void;
  onClose: () => void;
  onError: (error: unknown) => void;
  onMessage: (data: string) => void;
}

/**
 * Creates an EventSource connection with event handlers attached BEFORE connection opens.
 * This ensures we don't miss the 'open' event.
 */
export const createSSEConnection = async (
  endpoint: string,
  options: SSEConnectionOptions,
): Promise<EventSource> => {
  const URI = BASE_URL + API_PREFIX + endpoint;

  let es: EventSource;

  if (Platform.OS === "web") {
    // WEB: Native Browser API + Cookies
    // es = new EventSource(URI, { withCredentials: true });
    throw new Error("SSE connection on Web is not implemented yet.");
  } else {
    // NATIVE: React Native SSE + X-Session-Token
    const session_token = await secureStorage.get("X-Session-Token");

    if (!session_token) {
      throw new Error(
        "Cannot connect to SSE: No session token found on device.",
      );
    }

    es = new EventSource(URI, {
      headers: {
        "X-Session-Token": session_token,
      },
    });
  }

  // Attach listeners immediately after construction
  es.addEventListener("open", () => {
    console.debug("SSE connection opened");

    options.onOpen();
  });

  es.addEventListener("close", () => {
    console.debug("SSE connection closed");

    options.onClose();
  });

  es.addEventListener("error", (event) => {
    console.debug("SSE connection error");

    options.onError(event);
  });

  es.addEventListener("message", (event) => {
    console.debug("SSE connection received message:", event.data);

    if (event.data) {
      options.onMessage(event.data);
    }
  });

  return es;
};
