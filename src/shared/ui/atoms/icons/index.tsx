import React from 'react';

import Theme from '$shared/styles/color/theme';

import DarkIcon from './dark';
import EmailIcon from './email';
import GithubIcon from './github';
import InstagramIcon from './instagram';
import LightIcon from './light';
import LinkedInIcon from './linkedin';
import MenuIcon from './menu';
import SearchIcon from './search';

// global type
declare global {
  type IconType = 'none' | 'normal' | 'border';
  interface IconProps {
    className?: string;
    type?: IconType;
  }
  type IconElement = React.ReactElement;
}

// Icon Class
function getIconClass(props: IconProps) {
  const { type = 'none', className } = props;

  const IconClassMap = {
    border: Theme.ICON_CLASS,
    normal: Theme.PURE_ICON_CLASS,
    none: 'block',
  };

  return className || IconClassMap[type] || 'block';
}

// Data
class Icons {
  static createIcon(Component: React.ComponentType<IconProps>) {
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
}

export default Icons;
