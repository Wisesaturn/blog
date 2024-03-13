import ProgressBar from '$shared/ui/atoms/header/ProgressBar';
import Logo from '$shared/ui/atoms/header/Logo';
import Icons from '$shared/ui/atoms/icons';
import Menus from '$shared/ui/molecules/header/Menus';
import useLayout from '$shared/hooks/useLayout';
import Responsive from '$shared/ui/templates/Responsive';

import { HeaderMenu } from './constant';

const Header = () => {
  const { layout } = useLayout();
  const { header } = layout;

  // style
  const headerClass = `flex h-12 md:h-16 items-center max-w-layout justify-between z-[9998] align-middle bg-white dark:bg-[#232323] ease-in-out transition duration-200 justify-between w-full py-2 mx-auto relative`;
  const headerContainerClass = `fixed top-0 w-full bg-white border-b-[1px]`;

  return (
    <>
      <div className="md:h-16 h-12" />
      <div className={headerContainerClass}>
        <ProgressBar />
        <header className={headerClass}>
          <Responsive>
            <Responsive.Desktop>
              <Logo title={header.title} category={header.category} />
            </Responsive.Desktop>
          </Responsive>
          <div className="flex md:gap-6 md:m-0 mx-4 justify-between md:w-fit w-full gap-0 items-center">
            <Menus data={HeaderMenu} />
            {/* // TODO : 다크모드 기능 추가 필요 */}
            <Icons.Light />
          </div>
        </header>
      </div>
    </>
  );
};

export default Header;
