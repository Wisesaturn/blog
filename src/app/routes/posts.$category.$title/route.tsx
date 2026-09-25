import {
  HeadersFunction,
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
  data,
  useLoaderData,
} from 'react-router';

import { PostDetailPage } from '@/pages/post-detail';

import { getPost } from '@/entities/post/index.server';

import codeStyles from '@/commons/styles/etc/vscode-prism.css?url';
import formatStyleSheet from '@/commons/lib/formatStyleSheet';
import { DETAIL_CACHE_CONTROL } from '@/commons/config/cache';

import formatHeadTags from '../../lib/formatHeadTags';

// meta
export const meta: MetaFunction = (args) => {
  const urlPrefix = 'posts';
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
  const { category, title } = params;
  if (process.env.NODE_ENV !== 'development') {
    if (category === 'LOCAL_TEST' || category === 'LOCAL_WRITING')
      throw new Error('접속할 수 없는 페이지입니다');
  }
  if (!category || !title) throw new Error();

  const resolvedPost = await getPost({ category, title });

  return data(
    { post: resolvedPost },
    {
      headers: {
        'Cache-Control': DETAIL_CACHE_CONTROL,
      },
    },
  );
}

export default function Route() {
  const { post } = useLoaderData<typeof loader>();
  return <PostDetailPage post={post} />;
}
