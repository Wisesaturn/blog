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

import { ANIMATE_FADE_UP_CONTAINER, ANIMATE_FADE_UP_ITEM } from '@/shared/constant/animation';
import { DETAIL_CACHE_CONTROL } from '@/shared/constant/cache';
import useViewCount from '@/shared/hooks/useViewCount';
import formatHeadTags from '@/shared/lib/formatHeadTags';
import formatStyleSheet from '@/shared/lib/formatStyleSheet';
import codeStyles from '@/shared/styles/etc/vscode-prism.css?url';

import ArticleBox from '@/features/post/ui/organsims/ArticleBox';
import ArticleButtons from '@/features/post/ui/molecules/ArticleButtons';
import ArticleComments from '@/features/post/ui/atoms/ArticleComments';
import getPost from '@/features/post/api/getPost';

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

// page
export default function ArticlePage() {
  const { post } = useLoaderData<typeof loader>();
  const { category = '', title = '' } = useParams();
  const views = useViewCount(
    `/api/post-view/${encodeURIComponent(category)}/${encodeURIComponent(title)}`,
    post.views || 0,
  );

  return (
    <motion.main
      initial="hidden"
      animate="show"
      variants={ANIMATE_FADE_UP_CONTAINER}
      className="layout min-h-screen"
    >
      <ArticleBox post={{ ...post, views }} animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
      <ArticleButtons animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
      <ArticleComments animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
    </motion.main>
  );
}
