import { motion } from 'framer-motion';
import { LinksFunction, LoaderFunctionArgs, createCookie } from '@remix-run/node';
import { MetaFunction, defer, useLoaderData } from '@remix-run/react';

import getPost from '$features/post/api/getPost';
import updatePost from '$features/post/api/updatePost';
import ArticleComments from '$features/post/ui/atoms/ArticleComments';
import ArticleButtons from '$features/post/ui/molecules/ArticleButtons';
import ArticleBox from '$features/post/ui/organsims/ArticleBox';
import { IPost } from '$features/post/types/post';

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

  const post = getPost({ category, title }).then(async (resolvedPost) => {
    // cookie settings
    const hasUserVisited = createCookie(`${resolvedPost.index}`, {
      path: '/',
      secure: true,
      httpOnly: true,
      maxAge: 60 * 60 * 0.5,
    });
    const cookieHeader = request.headers.get('Cookie');
    const hasUserVisitedPage = await hasUserVisited.parse(cookieHeader);

    // ignore create cookie if it's development or alreeady has cookie
    if (hasUserVisitedPage || process.env.NODE_ENV === 'development') {
      return resolvedPost;
    }

    const updatedPost = { ...resolvedPost, views: (resolvedPost.views || 0) + 1 };

    // update post (view only)
    await updatePost({
      category,
      title,
      data: { views: updatedPost.views },
    });

    return updatedPost;
  });

  return defer(
    { post },
    {
      headers: {
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
