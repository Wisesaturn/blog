import { MetaFunction, useLoaderData } from 'react-router';

import { ProjectsPage } from '@/pages/projects';

import { sortProjects } from '@/entities/project';
import { getProjects } from '@/entities/project/index.server';

import formatHeadTags from '../../lib/formatHeadTags';

// meta
export const meta: MetaFunction = (args) => {
  const urlPrefix = 'projects';
  const title = 'Projects';
  return formatHeadTags({ urlPrefix, title, ...args });
};

// loader
export async function loader() {
  const projects = await getProjects();
  const sortedProjects = sortProjects(projects);

  return { projects: sortedProjects };
}

export default function Route() {
  const { projects } = useLoaderData<typeof loader>();
  return <ProjectsPage projects={projects} />;
}
