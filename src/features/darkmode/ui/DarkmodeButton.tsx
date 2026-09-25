import { useEffect } from 'react';

import useLayout from '@/commons/model/useLayout';
import { Darkmode } from '@/commons/types/layout';
import Icons from '@/commons/ui/icons/Icons';

import createDarkmodeCookie from '../lib/createDarkmodeCookie';

export default function DarkmodeButton() {
  const { layout, updateLayout } = useLayout();

  const handleSwitchDarkmodeClick = () => {
    const nextDarkmode: Darkmode = layout.darkmode === 'light' ? 'dark' : 'light';
    updateLayout({ darkmode: nextDarkmode });
    createDarkmodeCookie(nextDarkmode);
    document.documentElement.setAttribute('color-theme', nextDarkmode);
  };

  /**
   * `Layout` 의 인라인 스크립트가 페인트 전에 테마를 정해 둔다. 여기서는 그 값에 상태만 맞춘다.
   *
   * 예전에는 시스템 설정이 다크면 쿠키보다 앞세워 덮어썼다. 사용자가 밝은 테마를 골라도 다음 방문에
   * 다시 다크가 됐다. 쿠키도 여기서 심지 않는다. 심으면 그 뒤로 시스템 설정이 바뀌어도 따라가지 않는다.
   */
  useEffect(function syncDarkmodeWithDocument() {
    const current: Darkmode =
      document.documentElement.getAttribute('color-theme') === 'dark' ? 'dark' : 'light';
    if (current !== layout.darkmode) updateLayout({ darkmode: current });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <button aria-label="darkmode-button" type="button" onClick={handleSwitchDarkmodeClick}>
      {layout.darkmode === 'dark' ? <Icons.Dark type="border" /> : <Icons.Light type="border" />}
    </button>
  );
}
