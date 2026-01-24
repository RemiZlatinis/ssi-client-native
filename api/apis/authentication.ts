import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Platform } from "react-native";

import { GOOGLE_WEB_CLIENT_ID } from "@/config";
import secureStorage from "@/services/secureStorage";

import client from "../lib/client";

import { User } from "@/types";

const CLIENT_TYPE = Platform.OS === "web" ? "browser/" : "app/";

const URI = {
  "get-user": CLIENT_TYPE + "v1/auth/session",
  "login-google": CLIENT_TYPE + "v1/auth/provider/token",
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
 * If a `new_session` is provided (e.g., after a login), it stores the session token in
 * the secure storage.
 *
 * If no session is provided, it attempts to restore the last one by retrieving a stored
 * session token and validating it against the backend.
 *
 * In both cases, if successful, it sets the `X-Session-Token` header for the API client
 * and returns a `User` object. If fails returns `null`.
 *
 * @param new_session - Optional session object containing user data and token metadata.
 * @returns The authenticated `User` object if successful, otherwise `null`.
 */
async function authenticate(new_session?: Session): Promise<User | null> {
  let session;

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

    const res = await client.get<Session>(URI["get-user"]);

    if (!res.ok || !res.data) {
      if (res.status === 410) {
        console.warn("Session expired");

        // Remove the invalid session token
        await secureStorage.remove("X-Session-Token");
        return null;
      }
      console.error(res.problem);
      return null;
    }

    session = res.data;
  }

  return session.data.user;
}

function deauthenticate() {
  secureStorage.remove("X-Session-Token");
  client.setHeader("X-Session-Token", "");
}

/**
 * Initiates the Google Sign-In flow and authenticates with the SSI backend.
 *
 * On Native platforms, it uses the Google Sign-In SDK to obtain an ID Token,
 * which is then exchanged for an SSI session token.
 *
 * @returns The authenticated `User` object if successful, otherwise `null`.
 */
async function loginWithGoogle(): Promise<User | null> {
  let idToken: string | null | undefined = undefined;

  if (Platform.OS === "web") {
    idToken = await new Promise<string>((resolve, reject) => {
      // @ts-ignore
      window.google.accounts.id.initialize({
        client_id: GOOGLE_WEB_CLIENT_ID,
        use_fedcm_for_prompt: true, // Crucial for 2026 browser privacy
        callback: (res: { credential: string }) => {
          if (res.credential) resolve(res.credential);
          else reject("No token");
        },
      });
      // @ts-ignore
      window.google.accounts.id.prompt(); // Shows the "One Tap" UI
    });
  } else {
    // For Native
    await GoogleSignin.hasPlayServices();

    // Prompt the user for sign in (This step is silent is user has previously sign-in)
    const userInfo = await GoogleSignin.signIn();

    // Set ID Token
    idToken = userInfo.data?.idToken;
  }

  if (!idToken) {
    console.error("Google Sign-In Failed: No idToken received.");
    return null;
  }

  const response = await client.post<Session>(URI["login-google"], {
    process: "login",
    provider: "google",
    token: {
      client_id: GOOGLE_WEB_CLIENT_ID,
      id_token: idToken,
    },
  });

  if (!response.ok || !response.data) {
    // Login Failed
    console.error(response.data);

    return null;
  }
  return authenticate(response.data);
}

export default {
  authenticate,
  deauthenticate,
  loginWithGoogle,
};
