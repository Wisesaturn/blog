import { motion } from 'motion/react';

import { TOC } from '@/features/toc';

import { IProject } from '@/entities/project';

import ProjectTitle from './ProjectTitle';

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
          className="markdown-body w-full min-w-0 pt-10 md:max-w-[768px] md:flex-1"
          dangerouslySetInnerHTML={{ __html: body }}
        />
        <TOC body={body} />
      </motion.div>
    </>
  );
}
