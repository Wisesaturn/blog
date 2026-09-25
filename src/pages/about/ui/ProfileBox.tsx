import { IProfile } from '../model/types';
import ProfileDefaultInfo from './ProfileDefaultInfo';
import ProfileAccordionInfo from './ProfileAccordionInfo';
import ProfileSeparateInfo from './ProfileSeparateInfo';

interface Props extends GlobalAnimation {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info: IProfile<any>;
}

export default function ProfileBox(props: Props) {
  return (
    <>
      {props.info.type === 'default' && <ProfileDefaultInfo {...props} />}
      {props.info.type === 'accordion' && <ProfileAccordionInfo {...props} />}
      {props.info.type === 'separate' && <ProfileSeparateInfo {...props} />}
    </>
  );
}
