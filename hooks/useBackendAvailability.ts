import { useEffect, useState } from "react";

import { checkBackendAvailable } from "@/api/lib/health";

/**
 * Returns whether the backend is reachable:
 * - `true` — the backend answered any HTTP request
 * - `false` — unreachable (network error or timeout)
 * - `null` — the check is still in progress
 */
export default function useBackendAvailability(): boolean | null {
  const [available, setAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;

    checkBackendAvailable().then((result) => {
      if (isMounted) setAvailable(result);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return available;
}
