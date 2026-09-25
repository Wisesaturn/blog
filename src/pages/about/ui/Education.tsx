import { motion } from 'motion/react';

import PROFILE from '../config/ProfileData';
import ProfileCategory from './ProfileCategory';
import ProfileBox from './ProfileBox';

export default function Education({ animation }: GlobalAnimation) {
  return (
    <>
      <ProfileCategory animation={animation}>Education</ProfileCategory>
      <motion.section
        className="pt-8 pb-4 max-md:pt-4 max-md:pb-2 flex flex-col gap-6"
        variants={animation?.variants}
      >
        {PROFILE.education.map((info, idx) => (
          <ProfileBox animation={animation} info={info} key={info.title + idx} />
        ))}
      </motion.section>
    </>
  );
}
