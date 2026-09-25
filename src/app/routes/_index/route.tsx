import { motion } from 'motion/react';

import IntroduceSection from '@/features/home/ui/organisms/introduce-section';

import { ANIMATE_FADE_UP_CONTAINER } from '@/commons/config/animation';

export const MainPage = () => (
  <motion.main
    initial="hidden"
    animate="show"
    variants={ANIMATE_FADE_UP_CONTAINER}
    className="layout min-h-screen"
  >
    <IntroduceSection />
  </motion.main>
);

export default MainPage;
