import useScroll from '@hooks/useScroll';
import { Link } from '@remix-run/react';
import { useEffect } from 'react';

import type { CategoryType } from '@utils/constant/category';
import { ProgressBar } from './Components/ProgressBar';

import type { HeaderProps } from './types';

export default function Header(props: HeaderProps) {
  const { paths } = props;

  // style for scroll
  const { isScrollTop, isScrollDirection } = useScroll();
  const hasShadow = !isScrollTop ? 'shadow-md' : '';
  const hasDisabled = isScrollDirection === 'down' ? 'animate-upDisappear' : '';
  const isDefaultStyle = `glassMorphism flex z-[9999] fixed ease-in-out transition duration-200 justify-between w-full mx-auto items-center transition top-0 ${hasDisabled} ${hasShadow}`;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <ProgressBar />
      <header className={isDefaultStyle}>
        <div className="flex gap-2 ml-3 items-center">
          {paths
            .filter((e) => {
              return e.name !== 'undefined' && e.name !== '';
            })
            .map((ele: CategoryType) => {
              return (
                <>
                  <Link key={ele.link} className="flex items-center gap-2" to={ele.link}>
                    <span className="rounded active:bg-gray-200 duration-200 hover:bg-gray-100 hover: p-1 text-[0.9rem]">
                      {ele.name}
                    </span>
                    <span className="text-gray-300">{'>'}</span>
                  </Link>
                </>
              );
            })}
        </div>
        <nav className="w-9 h-9 m-3 shadow-md shadow-gray-500/50 rounded-full hover:cursor-pointer overflow-hidden">
          <img
            className="w-full h-full object-cover"
            alt="profile"
            src="https://avatars.githubusercontent.com/u/79848632?v=4"
          />
        </nav>
      </header>
      <div className="h-[3.75rem]" />
    </>
  );
}
