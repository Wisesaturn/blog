import { Link, useLocation } from '@remix-run/react';

import Theme from '$shared/styles/color/theme';

interface MenusProps {
  data: string[];
}

export default function Menus(props: MenusProps) {
  const { data } = props;
  const { pathname } = useLocation();

  const selectedClass = `text-green-main border-b-2 border-green-main`;
  const MenuClass = `${Theme.HoverClass} px-3 md:py-0 py-1.5 rounded-b-none md:text-lg text-xs`;

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
