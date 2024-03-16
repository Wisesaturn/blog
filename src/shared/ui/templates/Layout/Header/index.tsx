import ProgressBar from '$shared/ui/atoms/header/ProgressBar';
import Logo from '$shared/ui/atoms/header/Logo';
import Menus from '$shared/ui/molecules/header/Menus';
import useLayout from '$shared/hooks/useLayout';
import Responsive from '$shared/ui/templates/Responsive';
import DarkmodeButton from '$shared/ui/atoms/header/DarkmodeButton';

import { HeaderMenu } from './constant';

const Header = () => {
  const { layout } = useLayout();
  const { header } = layout;

  // style
  const HEADER_CLASS = `flex bg-white h-12 md:h-16 items-center z-[9998] align-middle glassmorphism justify-between layout py-2 relative`;
  const HEADER_CONTAINER_CLASS = `fixed top-0 w-full z-[9998]`;

  return (
    <>
      <div className="md:h-16 h-12" />
      <div className={HEADER_CONTAINER_CLASS}>
        <ProgressBar />
        <header className={HEADER_CLASS}>
          <Logo title={header.title} category={header.category} />
          <div className="flex md:gap-6 md:m-0 justify-between md:w-fit gap-0 items-center">
            <Responsive>
              <Responsive.Desktop>
                <Menus data={HeaderMenu} />
              </Responsive.Desktop>
            </Responsive>
            <DarkmodeButton />
          </div>
        </header>
      </div>
    </>
  );
};

export default Header;
