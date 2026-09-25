import { motion } from 'motion/react';

import { type IProject } from '@/entities/project';

import { ANIMATE_FADE_UP_CONTAINER, ANIMATE_FADE_UP_ITEM } from '@/commons/config/animation';
import Title from '@/commons/ui/Title';

import ProjectList from './ProjectList';

interface ProjectsPageProps {
  projects: Omit<IProject, 'body'>[];
}

/* -------------------------------------------------------------------------------------------------
 * ProjectsPage
 * 프로젝트 목록. 정렬은 loader 가 해서 넘긴다.
 * -----------------------------------------------------------------------------------------------*/
export default function ProjectsPage({ projects }: ProjectsPageProps) {
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
        subtitle="개발자로 성장해가며 만들었던 작품들입니다 (천천히 작성 중...)"
      />
      <ProjectList projects={projects} animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
    </motion.main>
  );
}
