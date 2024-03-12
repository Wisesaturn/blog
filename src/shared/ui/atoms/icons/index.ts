import DarkIcon from './dark';
import EmailIcon from './email';
import GithubIcon from './github';
import InstagramIcon from './instagram';
import LightIcon from './light';
import LinkedInIcon from './linkedin';
import MenuIcon from './menu';
import SearchIcon from './search';

const Icons = {
  Search: SearchIcon,
  Dark: DarkIcon,
  Light: LightIcon,
  Instagram: InstagramIcon,
  Email: EmailIcon,
  Github: GithubIcon,
  LinkedIn: LinkedInIcon,
  Menu: MenuIcon,
};

declare global {
  type IconsType = keyof typeof Icons;
}

export default Icons;
