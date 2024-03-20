import { motion } from 'framer-motion';
import { LoaderFunctionArgs, createCookie, json } from '@remix-run/node';
import { MetaFunction, useLoaderData } from '@remix-run/react';

import getPost from '$features/post/api/getPost';
import updatePost from '$features/post/api/updatePost';

import { ANIMATE_FADE_UP_CONTAINER, ANIMATE_FADE_UP_ITEM } from '$shared/constant/animation';
import formatHeadTags from '$shared/lib/formatHeadTags';

// meta
export const meta: MetaFunction = (args) => {
  const urlPrefix = 'posts';
  return formatHeadTags({ urlPrefix, ...args });
};

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
    return json({ post });
  }

  const views = post.views ? post.views + 1 : 1;
  post.views = views;

  // update view
  await updatePost({
    category,
    title,
    data: { views },
  });

  return json(
    { post },
    {
      headers: {
        'Set-Cookie': await hasUserVisited.serialize({}),
      },
    },
  );
}

// page
export default function ArticlePage() {
  const { post } = useLoaderData<typeof loader>();
  const { title, body } = post;

  return (
    <motion.main
      initial="hidden"
      animate="show"
      variants={ANIMATE_FADE_UP_CONTAINER}
      className="layout min-h-screen"
    >
      <motion.section variants={ANIMATE_FADE_UP_ITEM}>{title}</motion.section>
      <motion.div variants={ANIMATE_FADE_UP_ITEM} className="flex w-full max-w-layout">
        <motion.article>{body}</motion.article>
        <motion.aside>TOC 영역입니다</motion.aside>
      </motion.div>
    </motion.main>
  );
}
