export function getCSRFfromCookies(document: Document): string | null {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const match = cookie.match(/csrftoken=([^;]+)/);
    if (match) {
      return match[1];
    }
  }
  return null;
}
