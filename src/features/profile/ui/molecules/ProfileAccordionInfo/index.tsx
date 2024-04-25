import { motion } from 'framer-motion';

import { IProfile } from '$features/profile/types/profile';

import Accordion from '../../atoms/Accordion';

interface Props extends GlobalAnimation {
  info: IProfile<'accordion'>;
}

export default function ProfileAccordionInfo({ animation, info }: Props) {
  const { title, items } = info;

  return (
    <motion.div variants={animation?.variants} className="space-y-4">
      <h4 className="text-2xl max-md:text-xl font-medium">{title}</h4>
      <div className={`grid grid-cols-2 gap-4 max-md:gap-2 max-md:grid-cols-1`}>
        {items.map((item, index) => (
          <Accordion key={item.subTitle + index} item={item} />
        ))}
      </div>
    </motion.div>
  );
}
