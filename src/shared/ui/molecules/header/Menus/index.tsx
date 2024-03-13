import { Link, useLocation } from '@remix-run/react';

import Theme from '$shared/styles/color/theme';

interface MenusProps {
  data: string[];
}

export default function Menus(props: MenusProps) {
  const { data } = props;
  const { pathname } = useLocation();

  const selectedClass = `text-green-main border-b-2 border-green-main`;
  const MenuClass = `${Theme.HoverClass} md:px-3 md:py-1.5 px-2 py-1 rounded-b-none md:text-sm text-xs`;

  return (
    <div className="flex">
      {data.map((menu, idx) => {
        const isSelected = pathname === `/${menu}`;
        return (
          <Link key={idx} to={menu} className={`${MenuClass} ${isSelected ? selectedClass : ''}`}>
            {menu.toLocaleUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}
