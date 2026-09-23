import { HeadersFunction, MetaFunction, data, useLoaderData } from 'react-router';
import { motion } from 'motion/react';

import getProjects from '$features/project/api/getProjects';
import sortProjects from '$features/project/lib/sortProjects';
import ProjectCreater from '$features/project/ui/molecules/ProjectCreater';
import ProjectList from '$features/project/ui/organisms/ProjectList';

import { ANIMATE_FADE_UP_CONTAINER, ANIMATE_FADE_UP_ITEM } from '$shared/constant/animation';
import { LIST_CACHE_CONTROL } from '$shared/constant/cache';
import formatHeadTags from '$shared/lib/formatHeadTags';
import Title from '$shared/ui/atoms/Title';

// meta
export const meta: MetaFunction = (args) => {
  const urlPrefix = 'projects';
  const title = 'Projects';
  return formatHeadTags({ urlPrefix, title, ...args });
};

/**
 * loader 가 `data()` 에 넣은 헤더는 이 export 가 있어야 문서 응답과 `.data` 응답에 실린다.
 * 없으면 `Cache-Control` 이 빠져 CDN 이 캐시하지 않는다.
 */
export const headers: HeadersFunction = ({ loaderHeaders }) => loaderHeaders;

// loader
export async function loader() {
  const projects = await getProjects();
  const sortedProjects = sortProjects(projects);

  return data({ projects: sortedProjects }, { headers: { 'Cache-Control': LIST_CACHE_CONTROL } });
}

export default function ProjectsPage() {
  const { projects } = useLoaderData<typeof loader>();

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
      <ProjectCreater animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
      <ProjectList projects={projects} animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
    </motion.main>
  );
}
