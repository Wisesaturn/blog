import { IProfile } from '$features/profile/types/profile';

import ProfileDefaultInfo from '../../molecules/ProfileDefaultInfo';
import ProfileAccordionInfo from '../../molecules/ProfileAccordionInfo';
import ProfileSeparateInfo from '../../molecules/ProfileSeparateInfo';

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
