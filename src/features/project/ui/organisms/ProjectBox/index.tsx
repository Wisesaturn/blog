import { Await } from '@remix-run/react';
import { Suspense } from 'react';
import { motion } from 'framer-motion';

import ProjectTitle from '$features/project/ui/molecules/ProjectTitle';
import { IProject } from '$features/project/types/project';
import TOC from '$features/post/ui/molecules/TOC';

import PostSkeleton from '$shared/ui/molecules/Skeleton/PostSkeleton';

interface ProjectBoxProps extends GlobalAnimation {
  project: Promise<IProject>;
}

export default function ProjectBox({ project, animation }: ProjectBoxProps) {
  return (
    <Suspense fallback={<PostSkeleton />}>
      <Await resolve={project}>
        {(resolvedProject) => {
          const { body, ...rest } = resolvedProject;
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
        }}
      </Await>
    </Suspense>
  );
}
