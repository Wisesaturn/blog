import {
  HeadersFunction,
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
  data,
  useLoaderData,
  useParams,
} from 'react-router';
import { motion } from 'motion/react';

import getProject from '$features/project/api/getProject';
import ProjectComments from '$features/project/ui/atoms/ProjectComments';
import ProjectButtons from '$features/project/ui/molecules/ProjectButtons';
import ProjectBox from '$features/project/ui/organisms/ProjectBox';

import { ANIMATE_FADE_UP_CONTAINER, ANIMATE_FADE_UP_ITEM } from '$shared/constant/animation';
import { DETAIL_CACHE_CONTROL } from '$shared/constant/cache';
import useViewCount from '$shared/hooks/useViewCount';
import formatHeadTags from '$shared/lib/formatHeadTags';
import formatStyleSheet from '$shared/lib/formatStyleSheet';
import codeStyles from '$shared/styles/etc/vscode-prism.css?url';

// meta
export const meta: MetaFunction = (args) => {
  const urlPrefix = 'projects';
  return formatHeadTags({ urlPrefix, ...args });
};

// link
export const links: LinksFunction = () => [formatStyleSheet(codeStyles)];

/**
 * loader 가 `data()` 에 넣은 헤더는 이 export 가 있어야 문서 응답과 `.data` 응답에 실린다.
 * 없으면 `Cache-Control` 이 빠져 CDN 이 캐시하지 않는다.
 */
export const headers: HeadersFunction = ({ loaderHeaders }) => loaderHeaders;

// loader
export async function loader({ params }: LoaderFunctionArgs) {
  const { title } = params;
  if (!title) throw new Error();

  const resolvedProject = await getProject({ title });

  return data(
    { project: resolvedProject },
    {
      headers: {
        'Cache-Control': DETAIL_CACHE_CONTROL,
      },
    },
  );
}

export default function ProjectPage() {
  const { project } = useLoaderData<typeof loader>();
  const { title = '' } = useParams();
  const views = useViewCount(`/api/project-view/${encodeURIComponent(title)}`, project.views || 0);

  return (
    <motion.main
      initial="hidden"
      animate="show"
      variants={ANIMATE_FADE_UP_CONTAINER}
      className="layout min-h-screen"
    >
      <ProjectBox project={{ ...project, views }} animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
      <ProjectButtons animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
      <ProjectComments animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
    </motion.main>
  );
}
