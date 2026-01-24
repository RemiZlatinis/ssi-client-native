import { useRef } from "react";
import Text from "./AppText";
import { usePeriodicRerender } from "@/hooks";
import { HumanizeDate } from "@/utils/date";

// Extract props from the custom Text component
type AppTextProps = React.ComponentProps<typeof Text>;

interface LiveTimeAgoProps extends AppTextProps {
  date?: Date | string | null;
  fallback?: string;
  prefix?: string;
  suffix?: string;
}

/**
 * A Text component that automatically updates its relative time display (e.g., "5 minutes ago").
 * Uses a periodic re-render hook to ensure freshness without re-rendering parent components.
 */
export default function LiveTimeAgo({
  date,
  fallback = "Never",
  prefix = "",
  suffix = "",
  ...textProps
}: LiveTimeAgoProps) {
  // Re-render every 60 seconds to update the "HumanizeDate" output
  usePeriodicRerender(60000);

  // Handle various date formats (string, Date object)
  const dateObj = date ? new Date(date) : null;
  const timeString = HumanizeDate(dateObj, fallback);

  return (
    <Text {...textProps}>
      {prefix}
      {timeString}
      {suffix}
    </Text>
  );
}
