import React from 'react';
import { useLocation } from '@remix-run/react';

import NavButton from '$shared/ui/atoms/navigation-bar/_Button';
import Responsive from '$shared/ui/templates/Responsive';
import HomeIcon from '$shared/ui/atoms/icons/navigation-bar/home';
import PostIcon from '$shared/ui/atoms/icons/navigation-bar/post';
import ProfileIcon from '$shared/ui/atoms/icons/navigation-bar/profile';
import PortfolioIcon from '$shared/ui/atoms/icons/navigation-bar/portfolio';
import SnippetIcon from '$shared/ui/atoms/icons/navigation-bar/snippet';

/**
 * Only Use Navigation Bar
 */
const Icons = {
  Home: HomeIcon,
  Post: PostIcon,
  Profile: ProfileIcon,
  Portfolio: PortfolioIcon,
  Snippet: SnippetIcon,
};

function Nav({ children }: { children: React.ReactNode }) {
  if (!children || (React.isValidElement(children) && children.type !== NavButton)) {
    throw new Error('NaivgationBar에 속하는 컴포넌트를 담아야 합니다, (Button)');
  }

  return (
    <div className="fixed bottom-0 border-t-[1px] dark:border-none -shadow-t-2xl w-full bg-white dark:bg-black">
      <Responsive>
        <Responsive.Mobile>
          <div className="py-1.5 w-full flex items-center justify-around">{children}</div>
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
      <Nav.Button to="snippets" isSelected={checkSelected('snippets')}>
        <Icons.Snippet />
      </Nav.Button>
      <Nav.Button to="about" isSelected={checkSelected('about')}>
        <Icons.Profile />
      </Nav.Button>
    </Nav>
  );
}
