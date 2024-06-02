import { motion } from 'framer-motion';
import { LinksFunction, LoaderFunctionArgs, createCookie } from '@remix-run/node';
import { Await, MetaFunction, defer, useLoaderData } from '@remix-run/react';
import { Suspense } from 'react';

import getPost from '$features/post/api/getPost';
import updatePost from '$features/post/api/updatePost';
import ArticleTitle from '$features/post/ui/molecules/ArticleTitle';
import ArticleComments from '$features/post/ui/atoms/ArticleComments';
import useTOC from '$features/post/hooks/useTOC';
import TOC from '$features/post/ui/molecules/TOC';
import useCodePen from '$features/post/hooks/useCodePen';
import ArticleTags from '$features/post/ui/atoms/ArticleTags';
import ArticleButtons from '$features/post/ui/molecules/ArticleButtons';

import { ANIMATE_FADE_UP_CONTAINER, ANIMATE_FADE_UP_ITEM } from '$shared/constant/animation';
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
  if (!category || !title) throw new Error();

  const post = await getPost({ category, title });

  // cookie settings
  const hasUserVisited = createCookie(`${post.index}`, {
    path: '/',
    secure: true,
    httpOnly: true,
    maxAge: 60 * 60 * 0.5,
  });
  const cookieHeader = request.headers.get('Cookie');
  const hasUserVisitedPage = await hasUserVisited.parse(cookieHeader);

  // ignore create cookie if it's development or alreeady has cookie
  if (hasUserVisitedPage || process.env.NODE_ENV === 'development') {
    return defer({ post });
  }

  const views = post.views ? post.views + 1 : 1;
  post.views = views;

  // update view
  await updatePost({
    category,
    title,
    data: { views },
  });

  return defer(
    { post },
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
  const { body, tags, ...rest } = post;
  const TOCElement = useTOC(body);
  useCodePen();

  return (
    <motion.main
      initial="hidden"
      animate="show"
      variants={ANIMATE_FADE_UP_CONTAINER}
      className="layout min-h-screen"
    >
      <Suspense fallback={<div className="skeleton-item">포스트 로딩 중...</div>}>
        <Await resolve={post}>
          <ArticleTitle {...rest} animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
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
          <ArticleTags tags={tags} animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
        </Await>
      </Suspense>
      <ArticleButtons animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
      <ArticleComments animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
    </motion.main>
  );
}
