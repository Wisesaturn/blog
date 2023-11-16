import { Link } from '@remix-run/react';
import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { AiFillGithub, AiOutlineSearch } from 'react-icons/ai';

import useScroll from '@hooks/useScroll';

import type { CategoryType } from '@utils/constant/category';

import SearchContents from './Components/SearchContents';
import { ProgressBar } from './Components/ProgressBar';

import type { ChangeEvent, ForwardedRef } from 'react';
import type { HeaderProps } from './types';

export interface HeaderElement {
  onToggleSearchBar: () => void;
}

const Header = forwardRef((props: HeaderProps, ref: ForwardedRef<HeaderElement>) => {
  const { paths } = props;
  const [hasDisabled, setHasDisabled] = useState<string>('');
  const [hasShadow, setHasShadow] = useState<string>('');
  const [toggleSearchBar, setToggleSearchBar] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');

  const inputRef = useRef<HTMLInputElement | null>(null);
  // style for scroll
  const { isScrollTop, isScrollDirection } = useScroll();
  const isDefaultStyle = `glassMorphism flex z-[9999] bg-white fixed ease-in-out transition duration-200 justify-between w-full mx-auto h-min items-center transition top-0 ${hasDisabled} ${hasShadow}`;

  const onToggleSearchBar = () => {
    setToggleSearchBar(!toggleSearchBar);
    setInputValue('');
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setHasDisabled(isScrollDirection === 'down' ? 'animate-upDisappear' : '');
  }, [isScrollDirection]);

  useEffect(() => {
    setHasShadow(!isScrollTop ? 'shadow-md' : '');
  }, [isScrollTop]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [toggleSearchBar]);

  useImperativeHandle(ref, () => ({
    onToggleSearchBar,
  }));

  // style
  const styleIcon =
    'fill-gray-300 hover:fill-gray-600 rounded p-1 active:bg-gray-200 duration-200 hover:bg-gray-100';
  const styleIconWrapper =
    'hover:cursor-pointer rounded active:bg-gray-200 duration-200 hover:bg-gray-100';

  return (
    <>
      <ProgressBar />
      <header className={isDefaultStyle}>
        {toggleSearchBar ? (
          <>
            <input
              ref={inputRef}
              onChange={handleInputChange}
              className="placeholder:text-gray-500 px-8 focus:outline-none focus:border-green-main w-full border-r-2 h-max"
              placeholder="검색어를 입력해주세요"
            />
            <SearchContents input={inputValue} />
          </>
        ) : (
          <div className="flex gap-2 ml-3 items-center hidden-last-arrow whitespace-nowrap md:w-full w-2/3 overflow-hidden">
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
                    <span className={`${styleIcon} text-[0.9rem] overflow-hidden`}>
                      <span>{ele.name}</span>
                    </span>
                    <span className="text-gray-300">{'>'}</span>
                  </Link>
                );
              })}
          </div>
        )}
        <div className="flex py-2 px-3 gap-3 items-center">
          <span className={styleIconWrapper} onClick={onToggleSearchBar}>
            <AiOutlineSearch className={styleIcon} size="32" />
          </span>
          <a
            className={styleIconWrapper}
            href="https://www.github.com/wisesaturn"
            aria-label="follow my github"
          >
            <AiFillGithub className={styleIcon} size="32" />
          </a>
        </div>
      </header>
      <div className="h-[3rem]" />
      {toggleSearchBar && (
        <div
          className="animate-dim bg-gray-700 opacity-30 w-screen h-screen fixed top-0 left-0 z-[998]"
          onClick={onToggleSearchBar}
        />
      )}
    </>
  );
});

export default Header;
