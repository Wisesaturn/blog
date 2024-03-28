import { motion } from 'framer-motion';
import { MetaFunction } from '@remix-run/node';

import { ANIMATE_FADE_UP_CONTAINER, ANIMATE_FADE_UP_ITEM } from '$shared/constant/animation';
import Title from '$shared/ui/atoms/Title';
import formatHeadTags from '$shared/lib/formatHeadTags';

// meta
export const meta: MetaFunction = (args) => {
  const urlPrefix = 'projects';
  return formatHeadTags({ urlPrefix, ...args });
};

export default function ProjectsPage() {
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
        title="Projects"
        subtitle="개발자로 성장해가며 만들었던 작품들입니다"
      />
    </motion.main>
  );
}
