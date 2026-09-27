/**
 * @description Cookie 헤더에서 쿠키 하나의 값을 꺼낸다
 * @param params.cookieHeader `request.headers.get('Cookie')` 또는 `document.cookie` 의 값
 * @param params.cookieName 꺼낼 쿠키 이름
 * @returns 쿠키 값. 헤더가 없거나 쿠키가 없으면 `null`
 * @example
 * getCookie({ cookieHeader: 'a=1; version=dark', cookieName: 'version' }); // 'dark'
 */
export default function getCookie({
  cookieHeader,
  cookieName,
}: {
  cookieHeader: string | null;
  cookieName: string;
}) {
  if (cookieHeader === null) return null;

  const pattern = new RegExp(`(?<=${cookieName}=)[^;]*`);
  const match = cookieHeader.match(pattern);
  return match ? match[0] : null;
}
