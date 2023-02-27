import useScroll from '@hooks/useScroll';
import { Link, useLocation } from '@remix-run/react';
import { useEffect } from 'react';
import { ProgressBar } from './Components/ProgressBar';

export default function Header() {
  // path
  const location = useLocation();
  const category = location.pathname.split('/')[1];
  const postTitle = location.pathname.split('/')[2]
    ? decodeURI(location.pathname.split('/')[2])
    : '';

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
          <Link className="flex items-center gap-2" to={`/`}>
            <span className="rounded active:bg-gray-200 duration-200 hover:bg-gray-100 hover: p-1 text-[0.9rem]">
              📚 Jaehan's Blog
            </span>
          </Link>
          {category !== '' && (
            <>
              <span className="text-gray-300">{'>'}</span>
              <Link className="flex items-center gap-2" to={`/${category}`}>
                <span className="rounded active:bg-gray-200 duration-200 hover:bg-gray-100 hover: p-1 text-[0.9rem]">
                  {decodeURI(category).replace(/-/g, ' ')}
                </span>
              </Link>
            </>
          )}
          {postTitle !== '' && (
            <>
              <span className="text-gray-300">{'>'}</span>
              <Link className="flex items-center gap-2" to={`${postTitle}`}>
                <span className="rounded active:bg-gray-200 duration-200 hover:bg-gray-100 hover: p-1 text-[0.9rem]">
                  {decodeURI(postTitle).replace(/-/g, ' ')}
                </span>
              </Link>
            </>
          )}
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
