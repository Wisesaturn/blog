import { LinksFunction, LoaderFunctionArgs, MetaFunction, createCookie } from '@remix-run/node';
import { json, useLoaderData } from '@remix-run/react';
import { motion } from 'framer-motion';

import getProject from '$features/project/api/getProject';
import TOC from '$features/post/ui/molecules/TOC';
import useTOC from '$features/post/hooks/useTOC';
import ProjectComments from '$features/project/ui/atoms/ProjectComments';
import ProjectTitle from '$features/project/ui/molecules/ProjectTitle';
import ProjectButtons from '$features/project/ui/molecules/ProjectButtons';
import updateProject from '$features/project/api/updateProject';

import { ANIMATE_FADE_UP_CONTAINER, ANIMATE_FADE_UP_ITEM } from '$shared/constant/animation';
import formatHeadTags from '$shared/lib/formatHeadTags';
import formatStyleSheet from '$shared/lib/formatStyleSheet';
import codeStyles from '$shared/styles/etc/vscode-prism.css';

// meta
export const meta: MetaFunction = (args) => {
  const urlPrefix = 'projects';
  return formatHeadTags({ urlPrefix, ...args });
};

// link
export const links: LinksFunction = () => [formatStyleSheet(codeStyles)];

// loader
export async function loader({ params, request }: LoaderFunctionArgs) {
  const { title } = params;
  if (!title) throw new Error();

  const project = await getProject({ title });

  // cookie settings
  const hasUserVisited = createCookie(`${project.index}`, {
    path: '/',
    secure: true,
    httpOnly: true,
    maxAge: 60 * 60 * 0.5,
  });
  const cookieHeader = request.headers.get('Cookie');
  const hasUserVisitedPage = await hasUserVisited.parse(cookieHeader);

  // ignore create cookie if it's development or alreeady has cookie
  if (hasUserVisitedPage || process.env.NODE_ENV === 'development') {
    return json({ project });
  }

  const views = project.views ? project.views + 1 : 1;
  project.views = views;

  // update view
  await updateProject({
    title,
    data: { views },
  });

  return json(
    { project },
    {
      headers: {
        'Set-Cookie': await hasUserVisited.serialize({}),
      },
    },
  );
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
      <ProjectButtons animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
      <ProjectComments animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
    </motion.main>
  );
}
