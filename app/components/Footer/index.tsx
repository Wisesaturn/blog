import { GiHouse, GiNotebook, GiPapers } from 'react-icons/gi';
import { Link, useLocation } from '@remix-run/react';

type IsSelectedType = '' | 'all' | 'resume';

export default function Footer() {
  const location = useLocation();
  const isSelected = location.pathname.split('/')[1] as IsSelectedType;
  const iconStyle = `active:animate-push justify-between rounded-2xl flex px-10 gap-0.5 flex-col items-center hover:cursor-pointer`;

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
      <footer className="glassMorphism whitespace-nowrap shadow-invert fixed bottom-0 w-full pt-2 pb-1">
        <div className="flex mx-auto max-w-layout justify-around items-center">
          <Link className={iconStyle} to="/resume">
            <GiPapers color={`${onToggleStyle('resume').icon}`} size="1.5rem" />
            <span className={`${onToggleStyle('resume').text} text-[0.875rem]`}>이력서</span>
          </Link>
          <Link className={iconStyle} to="/">
            <GiHouse color={`${onToggleStyle('').icon}`} size=" 1.5rem" />
            <span className={`${onToggleStyle('').text} text-[0.875rem]`}>홈</span>
          </Link>
          <Link className={iconStyle} to="/all">
            <GiNotebook color={`${onToggleStyle('all').icon}`} size="1.5rem" />
            <span className={`${onToggleStyle('all').text} text-[0.875rem]`}>포스트</span>
          </Link>
        </div>
      </footer>
    </>
  );
}
