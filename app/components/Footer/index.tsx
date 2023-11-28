import { GiHouse, GiNotebook, GiPapers } from 'react-icons/gi';
import { Link, useLocation } from '@remix-run/react';

type IsSelectedType = '' | 'all' | 'resume';

function Footer() {
  const location = useLocation();
  const isSelected = location.pathname.split('/')[1] as IsSelectedType;
  const iconStyle = `active:animate-push justify-between rounded-2xl flex px-10 gap-1 md:gap-0.5 flex-col items-center hover:cursor-pointer`;

  const onToggleStyle = (input: IsSelectedType) => {
    if (isSelected === input) {
      return {
        icon: '#166534',
        text: 'text-green-800',
      };
    }
    return {
      icon: '#333',
      text: 'text-[#333]',
    };
  };

  return (
    <>
      <div className="h-[3.6875rem]" />
      <div className="glassMorphism whitespace-nowrap shadow-invert fixed bottom-0 w-full pt-2 pb-1 z-10">
        <div className="flex mx-auto max-w-layout justify-around items-center">
          <Link reloadDocument className={iconStyle} to="/resume">
            <GiPapers color={`${onToggleStyle('resume').icon}`} size="1.2rem" />
            <span className={`${onToggleStyle('resume').text} text-xs md:text-sm`}>이력서</span>
          </Link>
          <Link className={iconStyle} to="/">
            <GiHouse color={`${onToggleStyle('').icon}`} size="1.2rem" />
            <span className={`${onToggleStyle('').text} text-xs md:text-sm`}>홈</span>
          </Link>
          <Link className={iconStyle} to="/all">
            <GiNotebook color={`${onToggleStyle('all').icon}`} size="1.2rem" />
            <span className={`${onToggleStyle('all').text} text-xs md:text-sm`}>포스트</span>
          </Link>
        </div>
      </div>
    </>
  );
}
export default Footer;
