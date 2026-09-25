import { motion } from 'motion/react';

import { ANIMATE_FADE_UP_CONTAINER } from '@/commons/config/animation';

import IntroduceSection from './IntroduceSection';

/* -------------------------------------------------------------------------------------------------
 * HomePage
 * 첫 화면. 소개 섹션 하나를 그린다.
 * -----------------------------------------------------------------------------------------------*/
export default function HomePage() {
  return (
    <motion.main
      initial="hidden"
      animate="show"
      variants={ANIMATE_FADE_UP_CONTAINER}
      className="layout min-h-screen"
    >
      <IntroduceSection />
    </motion.main>
  );
}
