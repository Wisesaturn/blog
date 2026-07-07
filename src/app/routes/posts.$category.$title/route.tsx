import { createCookie, json, LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
import { MetaFunction, useLoaderData } from '@remix-run/react';
import { motion } from 'framer-motion';

import getPost from '$features/post/api/getPost';
import updatePost from '$features/post/api/updatePost';
import ArticleComments from '$features/post/ui/atoms/ArticleComments';
import ArticleButtons from '$features/post/ui/molecules/ArticleButtons';
import ArticleBox from '$features/post/ui/organsims/ArticleBox';

import { ANIMATE_FADE_UP_CONTAINER, ANIMATE_FADE_UP_ITEM } from '$shared/constant/animation';
import convertString from '$shared/lib/convertString';
import formatHeadTags from '$shared/lib/formatHeadTags';
import formatStyleSheet from '$shared/lib/formatStyleSheet';
import codeStyles from '$shared/styles/etc/vscode-prism.css';

// meta
export const meta: MetaFunction = (args) => {
  const urlPrefix = 'posts';
  return formatHeadTags({ urlPrefix, ...args });
};

// link
export const links: LinksFunction = () => [formatStyleSheet(codeStyles)];

// loader
export async function loader({ request, params }: LoaderFunctionArgs) {
  const { category, title } = params;
  if (process.env.NODE_ENV !== 'development') {
    if (category === 'LOCAL_TEST' || category === 'LOCAL_WRITING')
      throw new Error('접속할 수 없는 페이지입니다');
  }
  if (!category || !title) throw new Error();

  // cookie settings
  const cookieName = convertString(new URL(request.url).pathname, 'urlPathToCookieName');
  const hasUserVisited = createCookie(cookieName, {
    path: '/',
    secure: true,
    httpOnly: true,
    maxAge: 60 * 60 * 0.5,
  });
  const cookieHeader = request.headers.get('Cookie');
  const hasUserVisitedPage = await hasUserVisited.parse(cookieHeader);

  const resolvedPost = await getPost({ category, title });

  // ignore view count update if it's development or already has cookie
  if (!hasUserVisitedPage && process.env.NODE_ENV !== 'development') {
    // fire-and-forget: 응답을 블로킹하지 않고 조회수만 비동기로 갱신
    updatePost({
      category,
      title,
      data: { views: (resolvedPost.views || 0) + 1 },
    }).catch((err) => console.error(err));
  }

  return json(
    { post: resolvedPost },
    {
      headers: {
        'Set-Cookie': await hasUserVisited.serialize({}),
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=31556952',
      },
    },
  );
}

// page
export default function ArticlePage() {
  const { post } = useLoaderData<typeof loader>();

  return (
    <motion.main
      initial="hidden"
      animate="show"
      variants={ANIMATE_FADE_UP_CONTAINER}
      className="layout min-h-screen"
    >
      <ArticleBox post={post} animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
      <ArticleButtons animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
      <ArticleComments animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
    </motion.main>
  );
}
