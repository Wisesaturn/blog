import { Link } from '@remix-run/react';
import { useEffect, useRef } from 'react';
import { AiFillGithub, AiOutlineSearch } from 'react-icons/ai';

import useScroll from '@hooks/useScroll';

import type { CategoryType } from '@utils/constant/category';

import { ProgressBar } from './Components/ProgressBar';

import type { HeaderProps } from './types';

export default function Header(props: HeaderProps) {
  const { paths } = props;

  // style for scroll
  const { isScrollTop, isScrollDirection } = useScroll();
  const hasShadow = !isScrollTop ? 'shadow-md' : '';
  const hasDisabled = isScrollDirection === 'down' ? 'animate-upDisappear' : '';
  const isDefaultStyle = `glassMorphism flex z-[9999] fixed ease-in-out transition duration-200 justify-between w-full mx-auto h-min items-center transition top-0 ${hasDisabled} ${hasShadow}`;
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // style
  const styleIcon =
    'fill-gray-300 hover:fill-gray-600 rounded p-1 active:bg-gray-200 duration-200 hover:bg-gray-100';
  const styleIconWrapper =
    'hover:cursor-pointer rounded active:bg-gray-200 duration-200 hover:bg-gray-100';

  return (
    <>
      <ProgressBar />
      <header ref={headerRef} className={isDefaultStyle}>
        <div className="flex gap-2 ml-3 items-center hidden-last-arrow">
          {paths
            .filter((e) => {
              return e.name !== 'undefined' && e.name !== '';
            })
            .map((ele: CategoryType) => {
              return (
                <Link
                  reloadDocument
                  key={ele.name}
                  className="flex items-center gap-2"
                  to={ele.link}
                >
                  <span className={`${styleIcon} text-[0.9rem]`}>{ele.name}</span>
                  <span className="text-gray-300">{'>'}</span>
                </Link>
              );
            })}
        </div>
        <div className="flex py-2 px-3 gap-3 items-center">
          <span className={styleIconWrapper}>
            <AiOutlineSearch className={styleIcon} size="32" />
          </span>
          <a className={styleIconWrapper} href="https://www.github.com/wisesaturn">
            <AiFillGithub className={styleIcon} size="32" />
          </a>
        </div>
      </header>
      <div className="h-[3rem]" />
    </>
  );
}
