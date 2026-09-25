/**
 * @summary Cookie Header에서 특정 Cookie를 찾는 함수
 * @description request.header.get('cookie') 또는 document.cookie의 값을 header로 입력해야 합니다.
 * @param cookieHeader
 * @param cookieName
 * @returns
 */
export default function getCookie(cookieHeader: string | null, cookieName: string) {
  if (cookieHeader === null) return null;

  const pattern = new RegExp(`(?<=${cookieName}=)[^;]*`);
  const match = cookieHeader.match(pattern);
  return match ? match[0] : null;
}
