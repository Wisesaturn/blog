import { motion } from 'motion/react';

import ProjectTitle from '@/features/project/ui/molecules/ProjectTitle';
import { TOC } from '@/features/toc';

import { IProject } from '@/entities/project';

interface ProjectBoxProps extends GlobalAnimation {
  project: IProject;
}

export default function ProjectBox({ project, animation }: ProjectBoxProps) {
  const { body, ...rest } = project;

  return (
    <>
      <ProjectTitle {...rest} animation={{ variants: animation?.variants }} />
      <motion.div
        variants={animation?.variants}
        className="flex w-full max-w-layout max-md:flex-col-reverse"
      >
        <motion.article
          variants={animation?.variants}
          className="markdown-body md:w-3/4 w-full"
          dangerouslySetInnerHTML={{ __html: body }}
        />
        <TOC body={body} />
      </motion.div>
    </>
  );
}
