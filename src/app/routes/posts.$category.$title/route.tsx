import { motion } from 'framer-motion';
import { LinksFunction, LoaderFunctionArgs, createCookie, json } from '@remix-run/node';
import { MetaFunction, useLoaderData } from '@remix-run/react';

import getPost from '$features/post/api/getPost';
import updatePost from '$features/post/api/updatePost';
import PostTitle from '$features/post/ui/molecules/ArticleTitle';
import useTOC from '$features/post/hooks/useTOC';
import TOC from '$features/post/ui/molecules/TOC';

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
  const { body, tags, ...rest } = post;
  const TOCElement = useTOC(body);

  return (
    <motion.main
      initial="hidden"
      animate="show"
      variants={ANIMATE_FADE_UP_CONTAINER}
      className="layout min-h-screen"
    >
      <PostTitle {...rest} animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
      <motion.div
        variants={ANIMATE_FADE_UP_ITEM}
        className="flex w-full max-w-layout max-md:flex-col-reverse"
      >
        <motion.article className="markdown-body" dangerouslySetInnerHTML={{ __html: body }} />
        <TOC {...TOCElement} />
      </motion.div>
      <motion.div variants={ANIMATE_FADE_UP_ITEM}>
        <div className="flex gap-2">
          {tags.map((tag, idx) => (
            <span
              className="layout-text text-gray-600 dark:text-gray-300"
              key={idx}
            >{`#${tag.name}`}</span>
          ))}
        </div>
      </motion.div>
      <motion.div variants={ANIMATE_FADE_UP_ITEM}>댓글 영역입니다</motion.div>
    </motion.main>
  );
}
