import client from "./client";

/**
 * Checks if the backend is reachable by hitting the API root.
 * Any HTTP response (including 401/403) means the server is up.
 * A network error or timeout means it's unreachable.
 */
export async function checkBackendAvailable(): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);

  try {
    // Note: apisauce always resolves — network failures come back as
    // `{ ok: false, status: null }`, never as a rejection.
    const response = await client.get("", undefined, {
      signal: controller.signal,
    });
    return response.status != null;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}
