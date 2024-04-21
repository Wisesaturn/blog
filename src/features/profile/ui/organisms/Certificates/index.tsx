import { motion } from 'framer-motion';

import PROFILE from '$features/profile/constant/profile';

import ProfileCategory from '../../atoms/ProfileCategory';
import ProfileInfo from '../../molecules/ProfileInfo';

export default function Certificates({ animation }: GlobalAnimation) {
  return (
    <>
      <ProfileCategory animation={animation}>Certificates</ProfileCategory>
      <motion.section
        className="pt-8 pb-4 max-md:pt-4 max-md:pb-2 flex flex-col gap-8 max-md:gap-6"
        variants={animation?.variants}
      >
        {PROFILE.certificates.map((item, idx) => (
          <ProfileInfo animation={animation} key={`${item.title + idx}`} item={item} />
        ))}
      </motion.section>
    </>
  );
}
