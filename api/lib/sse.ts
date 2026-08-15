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

export type SSEConnection = EventSource | WebEventSource;

// Define the shape of a native EventSource for web platform
type WebEventSource = {
  addEventListener: (
    type: string,
    listener: (event: { data?: string }) => void,
  ) => void;
  removeEventListener: (
    type: string,
    listener: (event: { data?: string }) => void,
  ) => void;
  close: () => void;
  onopen?: () => void;
  onerror?: (error: unknown) => void;
  onmessage?: (event: { data?: string }) => void;
};

/**
 * Creates an EventSource connection with event handlers attached BEFORE connection opens.
 * This ensures we don't miss the 'open' event.
 *
 * WEB PLATFORM:
 *   - Uses native browser EventSource API
 *   - Sends cookies automatically with withCredentials: true
 *   - No manual header management needed (session cookie handles auth)
 *
 * NATIVE PLATFORM:
 *   - Uses react-native-sse library
 *   - Manually sends X-Session-Token header
 */
export const createSSEConnection = async (
  endpoint: string,
  options: SSEConnectionOptions,
): Promise<SSEConnection> => {
  const URI = BASE_URL + API_PREFIX + endpoint;

  let es: EventSource | WebEventSource;

  if (Platform.OS === "web") {
    // WEB: Native Browser API with cookies
    // Note: We cast window.EventSource to any because TypeScript doesn't know about it
    // in a React Native context, but it exists when running on web platform
    const WebES = (window as unknown as { EventSource: typeof EventSource })
      .EventSource;

    if (!WebES) {
      throw new Error("Native EventSource not available in this browser");
    }

    // Create native EventSource with credentials (cookies)
    // This automatically sends session cookies for authentication
    es = new WebES(URI, { withCredentials: true }) as WebEventSource;

    // Attach listeners for web EventSource
    const openHandler = () => {
      console.debug("SSE connection opened (web)");
      options.onOpen();
    };

    const errorHandler = (event: unknown) => {
      console.debug("SSE connection error (web):", event);
      options.onError(event);
    };

    const messageHandler = (event: { data?: string }) => {
      console.debug("SSE connection received message (web):", event.data);
      if (event.data) {
        options.onMessage(event.data);
      }
    };

    const closeHandler = () => {
      console.debug("SSE connection closed (web)");
      options.onClose();
    };

    // Native EventSource uses on* properties and addEventListener
    es.onopen = openHandler;
    es.onerror = errorHandler;
    es.onmessage = messageHandler;
    es.addEventListener("close", closeHandler);
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

    // Attach listeners for react-native-sse
    es.addEventListener("open", () => {
      console.debug("SSE connection opened (native)");
      options.onOpen();
    });

    es.addEventListener("close", () => {
      console.debug("SSE connection closed (native)");
      options.onClose();
    });

    es.addEventListener("error", (event) => {
      console.debug("SSE connection error (native):", event);
      options.onError(event);
    });

    es.addEventListener("message", (event) => {
      console.debug("SSE connection received message (native):", event.data);
      if (event.data) {
        options.onMessage(event.data);
      }
    });
  }

  return es;
};
