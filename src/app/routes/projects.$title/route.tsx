import { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json, useLoaderData } from '@remix-run/react';
import { motion } from 'framer-motion';

import getProject from '$features/project/api/getProject';
import TOC from '$features/post/ui/molecules/TOC';
import useTOC from '$features/post/hooks/useTOC';
import ArticleButtons from '$features/post/ui/molecules/ArticleButtons';
import ProjectComments from '$features/project/ui/atoms/ProjectComments';
import ProjectTitle from '$features/project/ui/molecules/ProjectTitle';

import { ANIMATE_FADE_UP_CONTAINER, ANIMATE_FADE_UP_ITEM } from '$shared/constant/animation';
import formatHeadTags from '$shared/lib/formatHeadTags';

// meta
export const meta: MetaFunction = (args) => {
  const urlPrefix = 'projects';
  return formatHeadTags({ urlPrefix, ...args });
};

// loader
export async function loader({ params }: LoaderFunctionArgs) {
  const { title } = params;
  if (!title) throw new Error();

  const project = await getProject({ title });
  return json({ project });
}

export default function ProjectPage() {
  const { project } = useLoaderData<typeof loader>();
  const { body, ...rest } = project;
  const TOCElement = useTOC(body);

  return (
    <motion.main
      initial="hidden"
      animate="show"
      variants={ANIMATE_FADE_UP_CONTAINER}
      className="layout min-h-screen"
    >
      <ProjectTitle {...rest} animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
      <motion.div
        variants={ANIMATE_FADE_UP_ITEM}
        className="flex w-full max-w-layout max-md:flex-col-reverse"
      >
        <motion.article
          variants={ANIMATE_FADE_UP_ITEM}
          className="markdown-body md:w-3/4 w-full"
          dangerouslySetInnerHTML={{ __html: body }}
        />
        <TOC {...TOCElement} />
      </motion.div>
      <ArticleButtons animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
      <ProjectComments animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
    </motion.main>
  );
}
