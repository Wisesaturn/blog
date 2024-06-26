import { motion } from 'framer-motion';

import PROFILE from '$features/profile/constant/profile';

import ProfileCategory from '../../atoms/ProfileCategory';
import ProfileBox from '../ProfileBox';

export default function Certificates({ animation }: GlobalAnimation) {
  return (
    <>
      <ProfileCategory animation={animation}>Certificates</ProfileCategory>
      <motion.section
        className="pt-8 pb-4 max-md:pt-4 max-md:pb-2 flex flex-col gap-6"
        variants={animation?.variants}
      >
        {PROFILE.certificates.map((info, idx) => (
          <ProfileBox animation={animation} info={info} key={info.title + idx} />
        ))}
      </motion.section>
    </>
  );
}
