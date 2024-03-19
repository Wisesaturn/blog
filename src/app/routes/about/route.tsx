import { motion } from 'framer-motion';

import { ANIMATE_FADE_UP_CONTAINER, ANIMATE_FADE_UP_ITEM } from '$shared/constant/animation';
import Title from '$shared/ui/atoms/Title';

export default function AboutPage() {
  return (
    <motion.main
      initial="hidden"
      animate="show"
      variants={ANIMATE_FADE_UP_CONTAINER}
      className="layout min-h-screen"
    >
      <Title
        animation={{
          variants: ANIMATE_FADE_UP_ITEM,
        }}
        title="About 송재한"
      />
    </motion.main>
  );
}
