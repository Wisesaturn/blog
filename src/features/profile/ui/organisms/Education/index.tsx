import { motion } from 'framer-motion';

import PROFILE from '$features/profile/constant/profile';
import ProfileCategory from '$features/profile/ui/atoms/ProfileCategory';

import ProfileInfo from '../../molecules/ProfileInfo';

export default function Education({ animation }: GlobalAnimation) {
  return (
    <>
      <ProfileCategory animation={animation}>Education</ProfileCategory>
      <motion.section
        className="pt-8 pb-4 max-md:pt-4 max-md:pb-2 flex flex-col gap-8 max-md:gap-6"
        variants={animation?.variants}
      >
        {PROFILE.education.map((item, idx) => (
          <ProfileInfo animation={animation} key={`${item.title + idx}`} item={item} />
        ))}
      </motion.section>
    </>
  );
}
