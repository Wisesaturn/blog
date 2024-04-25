import { motion } from 'framer-motion';

import { IProfile } from '$features/profile/types/profile';

interface Props extends GlobalAnimation {
  info: IProfile<'accordion'>;
}

export default function ProfileAccordionInfo({ animation, info }: Props) {
  const { title, items } = info;

  return (
    <motion.div variants={animation?.variants} className="space-y-1">
      <h4 className="text-2xl max-md:text-xl font-medium">{title}</h4>
    </motion.div>
  );
}
