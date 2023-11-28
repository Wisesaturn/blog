import { GiHouse, GiNotebook, GiPapers } from 'react-icons/gi';
import { Link, useLocation } from '@remix-run/react';

type IsSelectedType = '' | 'all' | 'resume';

function Footer() {
  const location = useLocation();
  const isSelected = location.pathname.split('/')[1] as IsSelectedType;
  const iconStyle = `active:animate-push-light active:dark:animate-push-dark justify-between rounded-2xl flex px-10 gap-1 md:gap-0.5 flex-col items-center hover:cursor-pointer`;

  const selectTextClass = `text-green-darker dark:text-green-bright text-xs md:text-sm`;
  const nonSelectTextClass = `text-black dark:text-white text-xs md:text-sm`;

  const selectIconClass = `fill-[#166534] dark:fill-[#bbfacb]`;

  const onToggleStyle = (path: string) => {
    if (path === isSelected) {
      return {
        text: selectTextClass,
        icon: selectIconClass,
      };
    }

    return {
      text: nonSelectTextClass,
      icon: '',
    };
  };

  return (
    <>
      <div className="h-[3.5rem]" />
      <div className="glassMorphism whitespace-nowrap shadow-invert fixed bottom-0 w-full pt-2 pb-1 z-10 dark:bg-[#232323]">
        <div className="flex mx-auto max-w-layout justify-around items-center">
          <Link reloadDocument className={iconStyle} to="/resume">
            <GiPapers className={onToggleStyle('resume').icon} size="1.2rem" />
            <span className={onToggleStyle('resume').text}>이력서</span>
          </Link>
          <Link className={iconStyle} to="/">
            <GiHouse className={onToggleStyle('').icon} size="1.2rem" />
            <span className={onToggleStyle('').text}>홈</span>
          </Link>
          <Link className={iconStyle} to="/all">
            <GiNotebook className={onToggleStyle('all').icon} size="1.2rem" />
            <span className={onToggleStyle('all').text}>포스트</span>
          </Link>
        </div>
      </div>
    </>
  );
}
export default Footer;
