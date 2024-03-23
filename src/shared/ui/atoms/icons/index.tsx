import React from 'react';

import DarkIcon from './dark';
import EmailIcon from './email';
import GithubIcon from './github';
import InstagramIcon from './instagram';
import LightIcon from './light';
import LinkedInIcon from './linkedin';
import MenuIcon from './menu';
import SearchIcon from './search';
import CancelIcon from './cancel';
import ArrowDownIcon from './arrowDown';
import ViewIcon from './view';
import ClockIcon from './clock';
import ShareIcon from './share';
import CopyIcon from './copy';
import DateIcon from './date';
import ArrowUpIcon from './arrowUp';
import RefreshIcon from './refresh';

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
}
declare global {
  type IconElement = keyof typeof Icons;
}

export default Icons;
