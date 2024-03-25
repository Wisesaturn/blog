import { Darkmode } from '$shared/types/layout';

/**
 * @summary 다크모드 쿠키를 클라이언트단에서 만드는 함수
 */
export default function createDarkmodeCookie(setting: Darkmode) {
  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + 1);
  document.cookie = `color-theme=${setting}; expires=${expirationDate.toUTCString()}; path=/`;
}
