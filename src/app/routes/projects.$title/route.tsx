import {
  HeadersFunction,
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
  data,
  useLoaderData,
} from 'react-router';

import { ProjectDetailPage } from '@/pages/project-detail';

import { getProject } from '@/entities/project/index.server';

import codeStyles from '@/commons/styles/etc/code-theme.css?url';
import formatStyleSheet from '@/commons/lib/formatStyleSheet';
import { DETAIL_CACHE_CONTROL } from '@/commons/config/cache';

import formatHeadTags from '../../lib/formatHeadTags';

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

export default function Route() {
  const { project } = useLoaderData<typeof loader>();
  return <ProjectDetailPage project={project} />;
}
