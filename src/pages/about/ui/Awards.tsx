import { motion } from 'motion/react';

import ProfileCategory from './ProfileCategory';
import PROFILE from '../config/profile';
import ProfileBox from './ProfileBox';

export default function Awards({ animation }: GlobalAnimation) {
  return (
    <>
      <ProfileCategory animation={animation}>Awards</ProfileCategory>
      <motion.section
        className="pt-8 pb-4 max-md:pt-4 max-md:pb-2 flex flex-col gap-6"
        variants={animation?.variants}
      >
        {PROFILE.awards.map((info, idx) => (
          <ProfileBox animation={animation} info={info} key={info.title + idx} />
        ))}
      </motion.section>
    </>
  );
}
