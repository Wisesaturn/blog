import { IProfile } from '$features/profile/types/profile';

import ProfileDefaultInfo from '../../molecules/ProfileDefaultInfo';
import ProfileAccordionInfo from '../../molecules/ProfileAccordionInfo';

interface Props extends GlobalAnimation {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info: IProfile<any>;
}

export default function ProfileBox(props: Props) {
  return (
    <>
      {props.info.type === 'default' && <ProfileDefaultInfo {...props} />}
      {props.info.type === 'accordion' && <ProfileAccordionInfo {...props} />}
    </>
  );
}
