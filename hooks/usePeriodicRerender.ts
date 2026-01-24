import { useEffect, useState } from "react";

/**
 * A hook that forces a re-render of the component at a specified interval.
 * @param interval - The interval in milliseconds at which to re-render the component.
 */
export default function usePeriodicRerender(interval: number) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((tick) => tick + 1);
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);
}
