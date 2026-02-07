import { API_PREFIX, BASE_URL } from "@/config";

function readCSRFfromCookies(): string | null {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const match = cookie.trim().match(/^csrftoken=([^;]+)/);
    if (match) {
      return match[1];
    }
  }
  return null;
}

/**
 * Gets the CSRF token from cookies. If not found, it tries to fetch it
 * from the backend once and then checks the cookies again.
 */
export async function getCSRFfromCookies(): Promise<string | null> {
  let token = readCSRFfromCookies();
  if (token) return token;

  console.debug("CSRF token not found in cookies, fetching from backend...");
  try {
    const response = await fetch(`${BASE_URL}${API_PREFIX}auth/csrf/`, {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      const bodyToken = data.csrfToken;

      // Try reading from cookie again (the fetch should have set it)
      token = readCSRFfromCookies();

      // If cookie reading still fails (e.g. cross-subdomain issues),
      // use the token from body
      if (!token && bodyToken) {
        console.debug(
          "CSRF token not readable from cookies, using body token.",
        );
        token = bodyToken;
      }
    }
  } catch (error) {
    console.error("Failed to fetch CSRF token:", error);
  }

  return token;
}
