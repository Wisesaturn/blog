import { AiOutlineMenu } from 'react-icons/ai';
import useScrollTopPosition from '@hooks/useScrollTopPosition';
import type { HeaderProps } from './types';
import { useRecoilValue } from 'recoil'
import { titleState } from '@utils/recoil/title';

export default function Header() {
  const onScrollTop = useScrollTopPosition();
  const hasShadow = !onScrollTop && 'shadow-md';
  const isDefaultStyle = `glassMorphism flex z-[9999] ease-in-out duration-200 justify-between w-full mx-auto items-center sticky top-0 ${hasShadow}`;
  const title = useRecoilValue(titleState);

  return (
    <header className={isDefaultStyle}>
      <nav>
        <button className="p-5">
          <AiOutlineMenu size="24" />
        </button>
      </nav>
      {!onScrollTop && title !== '' && (
        <div className="animate-open">
          <h3>{title}</h3>
        </div>
      )}
      <div className="w-9 h-9 m-3 shadow-md shadow-gray-500/50 rounded-full hover:cursor-pointer overflow-hidden">
        <img
          className="w-full h-full object-cover"
          alt="profile"
          src="https://avatars.githubusercontent.com/u/79848632?v=4"
        />
      </div>
    </header>
  );
}
