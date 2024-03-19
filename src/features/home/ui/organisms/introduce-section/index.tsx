import { motion } from 'framer-motion';

import { ANIMATE_FADE_UP_CONTAINER, ANIMATE_FADE_UP_ITEM } from '$shared/constant/animation';

export default function IntroduceSection() {
  return (
    <section className="min-h-screen max-w-layout w-full md:mx-auto md:px-0 px-4">
      <motion.div
        initial="hidden"
        animate="show"
        variants={ANIMATE_FADE_UP_CONTAINER}
        className="md:my-60 my-40 break-keep"
      >
        <motion.h1 variants={ANIMATE_FADE_UP_ITEM} className="text-gray-300">
          사툰사툰
        </motion.h1>
        <motion.h2
          variants={ANIMATE_FADE_UP_ITEM}
          className="md:text-[3.5rem] text-[1.75rem] leading-tight"
        >
          안녕하세요!
        </motion.h2>
        <motion.h2
          variants={ANIMATE_FADE_UP_ITEM}
          className="md:text-[4rem] text-[2rem] font-normal leading-tight"
        >
          프론트엔드 개발자 <b>송재한</b> 입니다
        </motion.h2>
      </motion.div>
    </section>
  );
}
