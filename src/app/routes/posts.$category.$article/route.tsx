import { motion } from 'framer-motion';

import { ANIMATE_FADE_UP_CONTAINER, ANIMATE_FADE_UP_ITEM } from '$shared/constant/animation';

export default function ArticlePage() {
  return (
    <motion.main
      initial="hidden"
      animate="show"
      variants={ANIMATE_FADE_UP_CONTAINER}
      className="layout min-h-screen"
    >
      <motion.section variants={ANIMATE_FADE_UP_ITEM}>제목 영역입니다</motion.section>
      <motion.div variants={ANIMATE_FADE_UP_ITEM} className="flex w-full">
        <motion.article>본문 영역입니다</motion.article>
        <motion.aside>TOC 영역입니다</motion.aside>
      </motion.div>
    </motion.main>
  );
}
