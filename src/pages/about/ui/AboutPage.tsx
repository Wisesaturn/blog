import { motion } from 'motion/react';

import { ANIMATE_FADE_UP_CONTAINER, ANIMATE_FADE_UP_ITEM } from '@/commons/config/animation';

import Activities from './Activities';
import Awards from './Awards';
import Certificates from './Certificates';
import Education from './Education';
import Experiences from './Experiences';
import ProfileTitle from './ProfileTitle';
import TechStacks from './TechStacks';
import Works from './Works';

/* -------------------------------------------------------------------------------------------------
 * AboutPage
 * 소개 페이지. 경력, 활동, 자격, 수상, 기술, 경험, 학력 순으로 그린다.
 * -----------------------------------------------------------------------------------------------*/
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
