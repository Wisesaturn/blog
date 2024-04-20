import { motion } from 'framer-motion';

import { IProfile } from '$features/profile/types/profile';

import Badge from '$shared/ui/atoms/Badge';

interface Props extends GlobalAnimation {
  item: IProfile;
}

export default function ProfileInfo({ animation, item }: Props) {
  return (
    <motion.div variants={animation?.variants} className="space-y-1">
      <h4 className="text-2xl max-md:text-xl">{item.title}</h4>
      {item.subTitle && <Badge>{item.subTitle}</Badge>}
      <div className="text-sm max-md:text-xs">{item.date}</div>
    </motion.div>
  );
}
