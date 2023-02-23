import useScroll from '@hooks/useScroll';
import { Link } from '@remix-run/react';
import type { ActionFunction } from '@remix-run/node';
import type { HeaderProps } from './types';

export const action: ActionFunction = (props: any) => {};

export default function Header(props: HeaderProps) {
  const { paths } = props;

  // paths.reduce((acc, cur) => {
  //   acc += `/${decodeURI(cur)}`;
  //    [`${decodeURI(cur)}`, `${decodeURI(acc)}`]
  //   return acc;
  // });

  const { isScrollTop, isScrollDirection } = useScroll();
  const hasShadow = !isScrollTop && 'shadow-md';
  const hasDisable = isScrollDirection === 'down' && 'animate-upDisappear';
  const isDefaultStyle = `glassMorphism flex z-[9999] sticky ease-in-out duration-200 justify-between w-full mx-auto items-center transition top-0 ${hasDisable} ${hasShadow}`;

  return (
    <header className={isDefaultStyle}>
      <div className="flex gap-3 ml-3"></div>
      <nav className="w-9 h-9 m-3 shadow-md shadow-gray-500/50 rounded-full hover:cursor-pointer overflow-hidden">
        <img
          className="w-full h-full object-cover"
          alt="profile"
          src="https://avatars.githubusercontent.com/u/79848632?v=4"
        />
      </nav>
    </header>
  );
}

// <Link className="flex items-center gap-2" key={idx} to={'w'}>
//   <span className="rounded active:bg-gray-200 duration-200 hover:bg-gray-100 hover: p-1 text-[0.9rem]">
//     {decodeURI(element).replace(/-/g, ' ')}
//   </span>
//   {idx < 3 && (<span>{">"}</span>)}
// </Link>
