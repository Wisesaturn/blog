import { Darkmode } from '@components/Header';

export default function createDarkmode(setting: Darkmode) {
  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + 1);
  document.cookie = `color-theme=${setting}; expires=${expirationDate.toUTCString()}; path=/`;
}
