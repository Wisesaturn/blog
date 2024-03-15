import useLayout from '$shared/hooks/useLayout';
import { Darkmode } from '$shared/types/middleware';
import Icons from '$shared/ui/atoms/icons';
import createDarkmodeCookie from '$shared/lib/createDarkmodeCookie';

export default function DarkmodeButton() {
  const { layout, updateLayout } = useLayout();

  const handleDarkmode = () => {
    const nextDarkmode: Darkmode = layout.darkmode === 'light' ? 'dark' : 'light';
    updateLayout({ darkmode: nextDarkmode });
    createDarkmodeCookie(nextDarkmode);
    document.documentElement.setAttribute('color-theme', nextDarkmode);
  };

  return (
    <button type="button" onClick={handleDarkmode}>
      {layout.darkmode === 'dark' ? <Icons.Dark /> : <Icons.Light />}
    </button>
  );
}
