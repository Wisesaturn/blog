import { motion } from 'framer-motion';

import { IProject } from '$features/project/types/project';

interface Props extends GlobalAnimation {
  projects: Omit<IProject, 'body'>[];
}

export default function ProjectList(props: Props) {
  const { animation, projects } = props;
  return <motion.div variants={animation?.variants}>ProjectList</motion.div>;
}
