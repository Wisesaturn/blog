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
      <motion.main className="my-4 flex justify-between" variants={animation?.variants}>
        <div>
          <p className="text-lg max-md:text-sm">소개 내용 적기</p>
        </div>
        <div className="w-[250px] h-[250px] max-md:w-[180px] max-md:h-[180px]">
          <img className="w-full h-full object-cover rounded-full" src={profile} alt="profile" />
        </div>
      </motion.main>
      <motion.h3 className="text-3xl max-md:text-lg" variants={animation?.variants}>
        Works (accodian)
      </motion.h3>
      <motion.h3 className="text-3xl max-md:text-lg" variants={animation?.variants}>
        Experiences (accodian)
      </motion.h3>
      <motion.h3 className="text-3xl max-md:text-lg" variants={animation?.variants}>
        Activities (accodian)
      </motion.h3>
      <motion.h3 className="text-3xl max-md:text-lg" variants={animation?.variants}>
        Tech Stacks (accodian)
      </motion.h3>
      <motion.h3 className="text-3xl max-md:text-lg" variants={animation?.variants}>
        Certificates
      </motion.h3>
      <motion.h3 className="text-3xl max-md:text-lg" variants={animation?.variants}>
        Awards
      </motion.h3>
      <motion.h3 className="text-3xl max-md:text-lg" variants={animation?.variants}>
        Education
      </motion.h3>
    </>
  );
}
