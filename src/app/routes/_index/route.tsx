import { motion } from 'motion/react';

import { ANIMATE_FADE_UP_CONTAINER } from '@/shared/constant/animation';

import IntroduceSection from '@/features/home/ui/organisms/introduce-section';

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
