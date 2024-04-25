import { motion } from 'framer-motion';
import { MetaFunction } from '@remix-run/node';

import ProfileTitle from '$features/profile/ui/molecules/ProfileTitle';
import Education from '$features/profile/ui/organisms/Education';
import Awards from '$features/profile/ui/organisms/Awards';
import Certificates from '$features/profile/ui/organisms/Certificates';
import TechStacks from '$features/profile/ui/organisms/TechStacks';
import Activities from '$features/profile/ui/organisms/Activities';
import Experiences from '$features/profile/ui/organisms/Experiences';
import Works from '$features/profile/ui/organisms/Works';

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
      <Works animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
      <Activities animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
      <Certificates animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
      <Awards animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
      <TechStacks animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
      <Experiences animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
      <Education animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
    </motion.main>
  );
}
