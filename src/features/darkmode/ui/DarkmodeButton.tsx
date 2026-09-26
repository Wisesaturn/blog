import { applyTheme, getDocumentTheme, storeTheme } from '@/commons/lib/theme';
import { type Darkmode } from '@/commons/types/layout';
import Icons from '@/commons/ui/icons/Icons';

import useFollowTheme from '../model/useFollowTheme';

export default function DarkmodeButton() {
  useFollowTheme();

  const handleSwitchDarkmodeClick = () => {
    const nextDarkmode: Darkmode = getDocumentTheme() === 'dark' ? 'light' : 'dark';
    storeTheme(nextDarkmode);
    applyTheme(nextDarkmode);
  };

  /**
   * 아이콘은 상태가 아니라 `dark:` 클래스로 고른다. 서버는 테마를 모르므로, 상태로 고르면
   * 하이드레이션 전까지 다크 화면에 해 아이콘이 보인다.
   */
  return (
    <button aria-label="darkmode-button" type="button" onClick={handleSwitchDarkmodeClick}>
      <span className="hidden dark:block">
        <Icons.Dark type="border" />
      </span>
      <span className="block dark:hidden">
        <Icons.Light type="border" />
      </span>
    </button>
  );
}
