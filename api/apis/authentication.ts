import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Platform } from "react-native";

import { API_PREFIX, BASE_URL, GOOGLE_WEB_CLIENT_ID } from "@/config";
import secureStorage from "@/services/secureStorage";

import client from "../lib/client";

import { User } from "@/types";
import { getCSRFfromCookies } from "../lib/csrf";

const CLIENT_TYPE = Platform.OS === "web" ? "browser/" : "app/";

const ENDPOINTS = {
  "current-session": CLIENT_TYPE + "v1/auth/session",
  "login-provider-token": "app/" + "v1/auth/provider/token",
  "login-provider-redirect": `${BASE_URL + API_PREFIX}browser/v1/auth/provider/redirect`,
};

// Configure the SignIn API to use the App's Web client ID
// We need the Web client because: ...
GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID,
});

type Session = {
  status: number;
  data: {
    user: User;
    methods: {
      method: string;
      at: number;
      email: string;
      username: string;
    }[];
  };
  meta: {
    session_token: string;
    access_token: string;
    is_authenticated: boolean;
  };
};

/**
 * Authenticates the user by either establishing a new session or restoring an existing one.
 *
 * For NATIVE platforms:
 *   - Uses X-Session-Token header-based authentication
 *   - Stores token in secureStorage
 *
 * For WEB platform:
 *   - Uses cookie-based session authentication
 *   - Browser handles cookies automatically (withCredentials: true)
 *   - No token storage needed
 *
 * @param new_session - Optional session object containing user data and token metadata (native only).
 * @returns The authenticated `User` object if successful, otherwise `null`.
 */
async function authenticate(new_session?: Session): Promise<User | null> {
  let session: Session | null = null;

  if (Platform.OS === "web") {
    // Web: Use cookies, no token management needed
    const res = await client.get<Session>(ENDPOINTS["current-session"]);

    if (!res.ok || !res.data || !res.data.meta.is_authenticated) {
      console.warn("Web session expired or invalid");
      return null;
    }

    session = res.data;
  } else {
    // Mobile: Use X-Session-Token headers
    if (new_session) {
      // Use the new session
      session = new_session;

      // Set the Header
      client.setHeader("X-Session-Token", session.meta.session_token);

      // Store the new session token
      await secureStorage.store("X-Session-Token", session.meta.session_token);
    } else {
      // Try to restore an active session if a valid session token exists
      const restored_session_token = await secureStorage.get("X-Session-Token");

      if (!restored_session_token) return null;

      // We need to restore the Header before the request
      client.setHeader("X-Session-Token", restored_session_token);

      const res = await client.get<Session>(ENDPOINTS["current-session"]);

      if (!res.ok || !res.data || !res.data.meta.is_authenticated) {
        if (
          res.status === 410 ||
          (res.data && !res.data.meta.is_authenticated)
        ) {
          console.warn("Session expired or invalid");

          // Remove the invalid session token
          await secureStorage.remove("X-Session-Token");
          return null;
        }
        console.error(res.problem);
        return null;
      }

      session = res.data;
    }
  }

  return session.data.user;
}

/**
 * Deauthenticates the user by logging out from the backend and clearing local storage.
 *
 * For NATIVE platforms:
 *   - Removes token from secureStorage
 *   - Clears X-Session-Token header
 *
 * For WEB platform:
 *   - Calls backend logout endpoint to clear cookies
 */
async function deauthenticate() {
  if (Platform.OS === "web") {
    // For web, call backend logout to clear session cookies
    const response = await client.delete(ENDPOINTS["current-session"]);

    if (!response.ok) console.error("Logout request failed:", response.problem);
  } else {
    // For mobile, clear stored token and header
    await secureStorage.remove("X-Session-Token");
    client.setHeader("X-Session-Token", "");

    // Sign out from Google to allow switching accounts next time
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      // It's possible we weren't signed in with Google, or it failed.
      // We log but don't block the deauthentication flow.
      console.warn("Google Sign-Out failed or already signed out:", error);
    }
  }
}

/**
 * Initiates the Google Sign-In flow and authenticates with the SSI backend.
 *
 * On Web: Uses browser redirect flow via form submission (as required by allauth).
 * On Native: Uses the Google Sign-In SDK to obtain an ID Token and exchange it
 * for an Back-end X-Session-Token.
 *
 * @returns The authenticated `User` object if successful, otherwise `null`.
 */
async function loginWithGoogle(): Promise<User | null | void> {
  // Web: Redirect Flow
  if (Platform.OS === "web") {
    const csrfToken = getCSRFfromCookies(document);
    if (!csrfToken) {
      console.error("CSRF token not found in cookies.");
      return null;
    }

    console.debug("CSRF token found:", csrfToken);
    console.debug("callback_url:", window.location.origin + "/auth/callback");

    // Create a form
    const form = document.createElement("form");
    form.method = "POST";
    form.action = ENDPOINTS["login-provider-redirect"];
    const formData: Record<string, string> = {
      csrfmiddlewaretoken: csrfToken,
      provider: "google",
      callback_url: window.location.origin + "/auth/callback",
      process: "login",
    };
    for (const [name, value] of Object.entries(formData)) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      form.appendChild(input);
    }

    // Add the form on document and submit it
    document.body.appendChild(form);
    form.submit();

    return; // browser will leave the page
  }

  // Native: Use Google Sign-In SDK
  await GoogleSignin.hasPlayServices();
  const userInfo = await GoogleSignin.signIn();
  const idToken = userInfo.data?.idToken;

  if (!idToken) {
    console.error("Google Sign-In Failed: No idToken received.");
    return null;
  }

  // Exchange the ID Token for a Session Token
  const response = await client.post<Session>(
    ENDPOINTS["login-provider-token"],
    {
      process: "login",
      provider: "google",
      token: {
        client_id: GOOGLE_WEB_CLIENT_ID,
        id_token: idToken,
      },
    },
  );

  // Google Login Failed
  if (!response.ok || !response.data) {
    console.error(response.data);
    return null;
  }

  // Success - Authenticate with the new session
  return authenticate(response.data);
}

/**
 * Returns the User or the current session.
 *
 * @returns The authenticated `User` object if successful, otherwise `null`.
 */
async function getSessionUser(): Promise<User | null> {
  const res = await client.get<Session>(ENDPOINTS["current-session"]);

  if (!res.ok || !res.data || !res.data.meta.is_authenticated) {
    return null;
  }

  return res.data.data.user;
}

export default {
  authenticate,
  deauthenticate,
  loginWithGoogle,
  getSessionUser,
};
