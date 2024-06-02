import { LinksFunction, LoaderFunctionArgs, MetaFunction, createCookie } from '@remix-run/node';
import { defer, useLoaderData } from '@remix-run/react';
import { motion } from 'framer-motion';

import getProject from '$features/project/api/getProject';
import ProjectComments from '$features/project/ui/atoms/ProjectComments';
import ProjectButtons from '$features/project/ui/molecules/ProjectButtons';
import updateProject from '$features/project/api/updateProject';
import ProjectBox from '$features/project/ui/organisms/ProjectBox';

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

  // cookie settings
  const hasUserVisited = createCookie(request.url, {
    path: '/',
    secure: true,
    httpOnly: true,
    maxAge: 60 * 60 * 0.5,
  });
  const cookieHeader = request.headers.get('Cookie');
  const hasUserVisitedPage = await hasUserVisited.parse(cookieHeader);

  const project = getProject({ title }).then(async (resolvedProject) => {
    // ignore create cookie if it's development or alreeady has cookie
    if (hasUserVisitedPage || process.env.NODE_ENV === 'development') {
      return resolvedProject;
    }

    const updatedProject = { ...resolvedProject, views: (resolvedProject.views || 0) + 1 };

    // update project (view only)
    await updateProject({
      title,
      meta: { views: updatedProject.views, index: resolvedProject.index },
    });

    return updatedProject;
  });

  return defer(
    { project },
    {
      headers: {
        'Set-Cookie': await hasUserVisited.serialize({}),
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=31556952',
      },
    },
  );
}

export default function ProjectPage() {
  const { project } = useLoaderData<typeof loader>();

  return (
    <motion.main
      initial="hidden"
      animate="show"
      variants={ANIMATE_FADE_UP_CONTAINER}
      className="layout min-h-screen"
    >
      <ProjectBox project={project} animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
      <ProjectButtons animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
      <ProjectComments animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
    </motion.main>
  );
}
