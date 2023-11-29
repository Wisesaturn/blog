import { Link } from '@remix-run/react';
import { useEffect, useState, forwardRef, useImperativeHandle, useRef, KeyboardEvent } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { MdDarkMode, MdOutlineDarkMode } from 'react-icons/md';

import useScroll from '@hooks/useScroll';

import IconDarkMode from '@components/Assets/IconDarkMode';
import IconSearch from '@components/Assets/IconSearch';

import type { CategoryType } from '@utils/constant/category';

import SearchContents from './Components/SearchContents';
import { ProgressBar } from './Components/ProgressBar';

import type { ChangeEvent, ForwardedRef } from 'react';
import type { HeaderProps } from './types';

export interface HeaderElement {
  onToggleSearchBar: () => void;
}

export type Darkmode = 'dark' | 'light';

const Header = forwardRef((props: HeaderProps, ref: ForwardedRef<HeaderElement>) => {
  const { paths } = props;
  const [hasDisabled, setHasDisabled] = useState<string>('');
  const [hasShadow, setHasShadow] = useState<string>('');
  const [toggleSearchBar, setToggleSearchBar] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [searchFocusRow, setSerachFocusRow] = useState(-1);
  const [isDarkmode, setIsDarkmode] = useState<Darkmode>(
    typeof window !== 'undefined'
      ? (document.documentElement.getAttribute('color-theme') as Darkmode)
      : 'light',
  );

  const inputRef = useRef<HTMLInputElement | null>(null);
  const searchSectionRef = useRef<HTMLElement | null>(null);

  // style for scroll
  const { isScrollTop, isScrollDirection } = useScroll();
  const isDefaultStyle = `glassMorphism flex z-[9999] bg-white dark:bg-[#232323] fixed ease-in-out transition duration-200 justify-between w-full mx-auto h-min items-center transition top-0 ${hasDisabled} ${hasShadow}`;

  const onToggleSearchBar = () => {
    setToggleSearchBar(!toggleSearchBar);
    setInputValue('');
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleInputKeyDown = (event: KeyboardEvent) => {
    const childElementCount = searchSectionRef.current?.childElementCount || 0;
    if (childElementCount < 1) return;
    if (childElementCount === 1 && searchSectionRef.current?.className.includes('no-search'))
      return;

    const getFocusHref =
      (searchFocusRow >= 0 &&
        searchSectionRef.current?.children[searchFocusRow].getAttribute('href')) ||
      '';

    switch (event.key) {
      case 'ArrowDown':
        setSerachFocusRow((prev) => prev + 1);
        if (searchSectionRef.current?.childElementCount === searchFocusRow + 1)
          setSerachFocusRow(0);
        break;
      case 'ArrowUp':
        setSerachFocusRow((prev) => prev - 1);
        if (searchFocusRow <= 0) {
          setSerachFocusRow(-1);
        }
        break;
      case 'Escape':
        setSerachFocusRow(-1);
        break;
      case 'Enter':
        window.location.href = getFocusHref;
        break;
      default:
        setSerachFocusRow(-1);
    }
  };

  const handleDarkmode = () => {
    if (isDarkmode === 'light') {
      setIsDarkmode('dark');
      // document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('color-theme', 'dark');
      localStorage.setItem('color-theme', 'dark');
    } else {
      setIsDarkmode('light');
      document.documentElement.setAttribute('color-theme', 'light');
      localStorage.setItem('color-theme', 'light');
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const hasThemeStorage = localStorage.getItem('color-theme') as Darkmode;

    if (hasThemeStorage) {
      setIsDarkmode(hasThemeStorage);
      document.documentElement.setAttribute('color-theme', hasThemeStorage);
    } else {
      const isBrowserDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      setIsDarkmode(isBrowserDarkTheme);
      document.documentElement.setAttribute('color-theme', isBrowserDarkTheme);
      localStorage.setItem('color-theme', isBrowserDarkTheme);
    }
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
    'fill-gray-300 dark:fill-gray-200 hover:dark:fill-white hover:fill-gray-600 rounded p-1 active:bg-gray-200 duration-200 hover:bg-gray-100 hover:dark:bg-[#111]';
  const styleIconWrapper =
    'hover:cursor-pointer rounded active:bg-gray-200 duration-200 hover:bg-gray-100 hover:dark:bg-[#222]';

  return (
    <>
      <ProgressBar />
      <header className={isDefaultStyle}>
        {toggleSearchBar ? (
          <>
            <input
              ref={inputRef}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              className="placeholder:text-gray-500 px-8 bg-inherit focus:outline-none focus:border-green-main w-full border-r-2 h-max"
              placeholder="검색어를 입력해주세요"
            />
            <SearchContents ref={searchSectionRef} input={inputValue} focusIdx={searchFocusRow} />
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
          <button
            type="button"
            aria-label="search button"
            className={styleIconWrapper}
            onClick={onToggleSearchBar}
          >
            <IconSearch />
          </button>
          <button
            type="button"
            className={styleIconWrapper}
            aria-label="darkmode button"
            onClick={handleDarkmode}
          >
            {isDarkmode === 'light' && <IconDarkMode />}
            {isDarkmode === 'dark' && <IconDarkMode />}
          </button>
        </div>
      </header>
      <div className="h-[3rem]" />
      {toggleSearchBar && (
        <div
          className="animate-dim dark:animate-dim-dark bg-gray-700 opacity-30 dark:opacity-80 dark:bg-[#000] w-screen h-screen fixed top-0 left-0 z-[998]"
          onClick={onToggleSearchBar}
        />
      )}
    </>
  );
});

export default Header;
