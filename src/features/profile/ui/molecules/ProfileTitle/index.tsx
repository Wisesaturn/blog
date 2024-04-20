import { motion } from 'framer-motion';

import Title from '$shared/ui/atoms/Title';
import profile from '$shared/assets/profile.jpg';

export default function ProfileTitle({ animation }: GlobalAnimation) {
  return (
    <>
      <Title
        animation={{
          variants: animation?.variants,
        }}
        title="About 송재한"
      />
      <motion.section
        className="my-4 flex justify-between max-md:flex-col-reverse max-md:items-center"
        variants={animation?.variants}
      >
        <div>
          <p className="text-lg max-md:text-sm max-md:pt-4 max-md:pb-8">소개 내용 적기</p>
        </div>
        <div className="w-[250px] h-[250px] max-md:w-[180px] max-md:h-[180px]">
          <img className="w-full h-full object-cover rounded-full" src={profile} alt="profile" />
        </div>
      </motion.section>
    </>
  );
}
