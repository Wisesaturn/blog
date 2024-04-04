import { motion } from 'framer-motion';

import ProjectShareButton from '../../atoms/ProjectShareButton';
import ProjectListButton from '../../atoms/ProjectListButton';

export default function ProjectButtons({ animation }: GlobalAnimation) {
  return (
    <motion.div
      className="flex items-center justify-center gap-2 w-full py-10"
      variants={animation?.variants}
    >
      <ProjectShareButton />
      <ProjectListButton />
    </motion.div>
  );
}
