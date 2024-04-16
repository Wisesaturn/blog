import { motion } from 'framer-motion';
import { MetaFunction } from '@remix-run/node';

import ProfileTitle from '$features/profile/ui/molecules/ProfileTitle';

import { ANIMATE_FADE_UP_CONTAINER, ANIMATE_FADE_UP_ITEM } from '$shared/constant/animation';
import formatHeadTags from '$shared/lib/formatHeadTags';

// meta
export const meta: MetaFunction = (args) => {
  const urlPrefix = 'about';
  return formatHeadTags({ urlPrefix, ...args });
};

export default function AboutPage() {
  return (
    <motion.main
      initial="hidden"
      animate="show"
      variants={ANIMATE_FADE_UP_CONTAINER}
      className="layout min-h-screen"
    >
      <ProfileTitle animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
    </motion.main>
  );
}
