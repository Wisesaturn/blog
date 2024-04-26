import { motion } from 'framer-motion';
import { MetaFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import ProjectCreater from '$features/project/ui/molecules/ProjectCreater';
import getProjects from '$features/project/api/getProjects';
import ProjectList from '$features/project/ui/organisms/ProjectList';
import sortProjects from '$features/project/lib/sortProjects';

import { ANIMATE_FADE_UP_CONTAINER, ANIMATE_FADE_UP_ITEM } from '$shared/constant/animation';
import Title from '$shared/ui/atoms/Title';
import formatHeadTags from '$shared/lib/formatHeadTags';

// meta
export const meta: MetaFunction = (args) => {
  const urlPrefix = 'projects';
  const title = '사툰사툰 :: Projects';
  return formatHeadTags({ urlPrefix, title, ...args });
};

// loader
export async function loader() {
  const projects = await getProjects();
  const sortedProjects = sortProjects(projects);

  return json({ projects: sortedProjects });
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
        subtitle="개발자로 성장해가며 만들었던 작품들입니다"
      />
      <ProjectCreater animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
      <ProjectList projects={projects} animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
    </motion.main>
  );
}
