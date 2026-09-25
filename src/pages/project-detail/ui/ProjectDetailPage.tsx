import { motion } from 'motion/react';
import { useParams } from 'react-router';

import { ProjectComments } from '@/features/comments';
import { useViewCount } from '@/features/view-count';

import { type IProject, projectQueries } from '@/entities/project';

import { ANIMATE_FADE_UP_CONTAINER, ANIMATE_FADE_UP_ITEM } from '@/commons/config/animation';

import ProjectBox from './ProjectBox';
import ProjectButtons from './ProjectButtons';

interface ProjectDetailPageProps {
  project: IProject;
}

/* -------------------------------------------------------------------------------------------------
 * ProjectDetailPage
 * 프로젝트 상세. 본문, 목록·공유 버튼, 댓글을 그리고 조회수를 올린다.
 * -----------------------------------------------------------------------------------------------*/
export default function ProjectDetailPage({ project }: ProjectDetailPageProps) {
  const { title = '' } = useParams();
  const views = useViewCount(projectQueries.views(title), project.views || 0);

  return (
    <motion.main
      initial="hidden"
      animate="show"
      variants={ANIMATE_FADE_UP_CONTAINER}
      className="layout min-h-screen"
    >
      <ProjectBox project={{ ...project, views }} animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
      <ProjectButtons animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
      <ProjectComments animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
    </motion.main>
  );
}
