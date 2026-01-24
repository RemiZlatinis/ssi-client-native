/**
 * Humanizes a date into a readable string like "Just now", "5 minutes ago", etc.
 * @param date - The date to humanize
 * @returns A human-readable string representing the time elapsed since the date
 */
export function HumanizeDate(
  date?: Date | null,
  fallback: string = "Never",
): string {
  if (!date) return fallback;

  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) {
    return "Just now";
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? "s" : ""} ago`;
}

/**
 * Safely converts ISO date string to Date object
 * Handles null values and invalid date strings gracefully
 *
 * @param dateString - ISO 8601 date string or null
 * @returns Date object or null if invalid/empty
 */
export function dateStringToDate(dateString: string | null): Date | null {
  if (dateString === null) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}
