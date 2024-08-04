import { useEffect } from 'react';

import useLayout from '$shared/hooks/useLayout';
import { Darkmode } from '$shared/types/layout';
import Icons from '$shared/ui/atoms/icons';
import createDarkmodeCookie from '$shared/lib/createDarkmodeCookie';

export default function DarkmodeButton() {
  const { layout, updateLayout } = useLayout();

  const handleSwitchDarkmodeClick = () => {
    const nextDarkmode: Darkmode = layout.darkmode === 'light' ? 'dark' : 'light';
    updateLayout({ darkmode: nextDarkmode });
    createDarkmodeCookie(nextDarkmode);
    document.documentElement.setAttribute('color-theme', nextDarkmode);
  };

  useEffect(function initialDarkmode() {
    const isBrowserDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    if (isBrowserDarkTheme === 'dark') {
      updateLayout({ darkmode: isBrowserDarkTheme });
      createDarkmodeCookie(isBrowserDarkTheme);
      document.documentElement.setAttribute('color-theme', isBrowserDarkTheme);
    } else {
      createDarkmodeCookie(layout.darkmode);
      document.documentElement.setAttribute('color-theme', layout.darkmode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <button aria-label="darkmode-button" type="button" onClick={handleSwitchDarkmodeClick}>
      {layout.darkmode === 'dark' ? <Icons.Dark type="border" /> : <Icons.Light type="border" />}
    </button>
  );
}
