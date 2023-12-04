export default function getCookieValue(cookieHeader: string | null, cookieName: string) {
  if (cookieHeader === null) return null;

  const pattern = new RegExp(`(?<=${cookieName}=)[^;]*`);
  const match = cookieHeader.match(pattern);
  return match ? match[0] : null;
}
