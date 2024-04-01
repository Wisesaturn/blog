import { motion } from 'framer-motion';

import { IProject } from '$features/project/types/project';

import ProjectCard from '../../molecules/ProjectCard';

interface Props extends GlobalAnimation {
  projects: Omit<IProject, 'body'>[];
}

export default function ProjectList(props: Props) {
  const { animation, projects } = props;
  return (
    <motion.div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-4 mt-6">
      {projects.map((project) => (
        <ProjectCard animation={animation} key={project.index} {...project} />
      ))}
    </motion.div>
  );
}
