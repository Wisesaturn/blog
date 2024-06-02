import { Await } from '@remix-run/react';
import { Suspense } from 'react';
import { motion } from 'framer-motion';

import ArticleTitle from '$features/post/ui/molecules/ArticleTitle';
import ArticleTags from '$features/post/ui/atoms/ArticleTags';
import TOC from '$features/post/ui/molecules/TOC';
import useCodePen from '$features/post/hooks/useCodePen';
import { IPost } from '$features/post/types/post';

import PostSkeleton from '$shared/ui/molecules/Skeleton/PostSkeleton';

interface ArticeBoxProps extends GlobalAnimation {
  post: Promise<IPost>;
}

export default function ArticleBox({ post, animation }: ArticeBoxProps) {
  useCodePen();

  return (
    <Suspense fallback={<PostSkeleton />}>
      <Await resolve={post}>
        {(resolvedPost) => {
          const { body, tags, ...rest } = resolvedPost;
          return (
            <>
              <ArticleTitle {...rest} animation={{ variants: animation?.variants }} />
              <motion.div
                variants={animation?.variants}
                className="flex w-full max-w-layout max-md:flex-col-reverse"
              >
                <motion.article
                  variants={animation?.variants}
                  className="markdown-body md:w-3/4 w-full"
                  dangerouslySetInnerHTML={{ __html: body }}
                />
                <TOC body={body} />
              </motion.div>
              <ArticleTags tags={tags} animation={{ variants: animation?.variants }} />
            </>
          );
        }}
      </Await>
    </Suspense>
  );
}
