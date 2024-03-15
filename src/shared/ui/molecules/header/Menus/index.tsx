import { Link, useLocation } from '@remix-run/react';

import Theme from '$shared/styles/color/theme';

interface MenusProps {
  data: string[];
}

export default function Menus(props: MenusProps) {
  const { data } = props;
  const { pathname } = useLocation();

  const SELECTED_CLASS = `text-green-main border-b-2 border-green-main`;
  const MENU_CLASS = `${Theme.HOVER_CLASS} md:px-3 md:py-1.5 px-2 py-1 rounded-b-none md:text-sm text-xs`;

  return (
    <div className="flex">
      {data.map((menu, idx) => {
        const isSelected = pathname === `/${menu}`;
        return (
          <Link key={idx} to={menu} className={`${MENU_CLASS} ${isSelected ? SELECTED_CLASS : ''}`}>
            {menu.toLocaleUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}
