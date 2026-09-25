import React from 'react';

import DarkIcon from './Dark';
import EmailIcon from './Email';
import GithubIcon from './Github';
import InstagramIcon from './Instagram';
import LightIcon from './Light';
import LinkedInIcon from './Linkedin';
import MenuIcon from './Menu';
import SearchIcon from './Search';
import CancelIcon from './Cancel';
import ArrowDownIcon from './ArrowDown';
import ViewIcon from './View';
import ClockIcon from './Clock';
import ShareIcon from './Share';
import CopyIcon from './Copy';
import DateIcon from './Date';
import ArrowUpIcon from './ArrowUp';
import RefreshIcon from './Refresh';
import ListIcon from './List';
import WebIcon from './Web';

// global type
declare global {
  type IconType = 'none' | 'normal' | 'border';
  type IconSize = 'small' | 'medium' | 'large';
  interface IconProps {
    className?: string;
    size?: IconSize;
    type?: IconType;
  }
}

// Icon Class
function getIconClass(props: IconProps) {
  const { size = 'medium', type = 'none', className } = props;

  const IconTypeClassMap = {
    border: 'icons',
    normal: 'icons-pure',
    none: 'block',
  };

  const IconSizeClassMap = {
    small: 'icons-size-small',
    medium: 'icons-size-medium',
    large: 'icons-size-large',
  };

  return (
    className || `${IconTypeClassMap[type]} ${IconSizeClassMap[size]}` || 'block icons-size-medium'
  );
}

// Data
class Icons {
  private static createIcon(Component: React.ComponentType<IconProps>) {
    return (props: IconProps) => {
      const iconClass = getIconClass(props);
      return <Component className={iconClass} />;
    };
  }

  static Dark = Icons.createIcon(DarkIcon);

  static Light = Icons.createIcon(LightIcon);

  static Search = Icons.createIcon(SearchIcon);

  static Email = Icons.createIcon(EmailIcon);

  static Github = Icons.createIcon(GithubIcon);

  static LinkedIn = Icons.createIcon(LinkedInIcon);

  static Menu = Icons.createIcon(MenuIcon);

  static Instagram = Icons.createIcon(InstagramIcon);

  static Cancel = Icons.createIcon(CancelIcon);

  static ArrowDown = Icons.createIcon(ArrowDownIcon);

  static ArrowUp = Icons.createIcon(ArrowUpIcon);

  static View = Icons.createIcon(ViewIcon);

  static Clock = Icons.createIcon(ClockIcon);

  static Share = Icons.createIcon(ShareIcon);

  static Copy = Icons.createIcon(CopyIcon);

  static Date = Icons.createIcon(DateIcon);

  static Refresh = Icons.createIcon(RefreshIcon);

  static List = Icons.createIcon(ListIcon);

  static Web = Icons.createIcon(WebIcon);
}
declare global {
  type IconElement = keyof typeof Icons;
}

export default Icons;
