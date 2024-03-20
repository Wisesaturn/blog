import { motion } from 'framer-motion';
import { LoaderFunctionArgs, json } from '@remix-run/node';
import { MetaFunction, useLoaderData } from '@remix-run/react';

import getPost from '$features/post/api/getPost';

import { ANIMATE_FADE_UP_CONTAINER, ANIMATE_FADE_UP_ITEM } from '$shared/constant/animation';
import formatHeadTags from '$shared/lib/formatHeadTags';

// meta
export const meta: MetaFunction = (args) => {
  const urlPrefix = 'posts';
  return formatHeadTags({ urlPrefix, ...args });
};

// loader
export async function loader({ params }: LoaderFunctionArgs) {
  const { category, title } = params;

  if (!category || !title) throw new Error();
  const post = await getPost({ category, title });

  return json({ post });
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
