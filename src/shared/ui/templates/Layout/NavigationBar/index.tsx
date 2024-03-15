import React from 'react';
import { useLocation } from '@remix-run/react';

import NavButton from '$shared/ui/atoms/navigationBar/_Button';
import Responsive from '$shared/ui/templates/Responsive';
import HomeIcon from '$shared/ui/atoms/icons/navigationBar/home';
import PostIcon from '$shared/ui/atoms/icons/navigationBar/post';
import ProfileIcon from '$shared/ui/atoms/icons/navigationBar/profile';
import PortfolioIcon from '$shared/ui/atoms/icons/navigationBar/portfolio';

/**
 * Only Use Navigation Bar
 */
const Icons = {
  Home: HomeIcon,
  Post: PostIcon,
  Profile: ProfileIcon,
  Portfolio: PortfolioIcon,
};

function Nav({ children }: { children: React.ReactNode }) {
  if (!children || (React.isValidElement(children) && children.type !== NavButton)) {
    throw new Error('NaivgationBar에 속하는 컴포넌트를 담아야 합니다, (Button)');
  }

  return (
    <div className="py-1 fixed bottom-0 border-t-[1px] w-full">
      <Responsive>
        <Responsive.Mobile>
          <div className="w-full flex items-center justify-around">{children}</div>
        </Responsive.Mobile>
      </Responsive>
    </div>
  );
}

Nav.Button = NavButton;

export default function NavigationBar() {
  const { pathname } = useLocation();

  const checkSelected = (path: string) => pathname === `/${path}`;

  return (
    <Nav>
      <Nav.Button to="/" isSelected={checkSelected('')}>
        <Icons.Home />
      </Nav.Button>
      <Nav.Button to="posts" isSelected={checkSelected('posts')}>
        <Icons.Post />
      </Nav.Button>
      <Nav.Button to="projects" isSelected={checkSelected('projects')}>
        <Icons.Portfolio />
      </Nav.Button>
      <Nav.Button to="about" isSelected={checkSelected('about')}>
        <Icons.Profile />
      </Nav.Button>
    </Nav>
  );
}
