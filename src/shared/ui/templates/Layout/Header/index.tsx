import ProgressBar from '$shared/ui/atoms/header/ProgressBar';
import Logo from '$shared/ui/atoms/header/Logo';
import Icons from '$shared/ui/atoms/icons';
import Menus from '$shared/ui/molecules/header/Menus';

import { HeaderMenu } from './constant';

const Header = () => {
  // style
  const headerClass = `flex items-center max-w-layout justify-between z-[9998] bg-white dark:bg-[#232323] ease-in-out transition duration-200 justify-between w-full top-0 py-2 relative`;

  return (
    <>
      <ProgressBar />
      <header className={headerClass}>
        <Logo />
        <div className="flex md:gap-6 md:m-0 justify-between md:w-fit w-full gap-0 items-center">
          <Menus data={HeaderMenu} />
          {/* // TODO : 다크모드 기능 추가 필요 */}
          <Icons.Light />
        </div>
      </header>
    </>
  );
};

export default Header;
