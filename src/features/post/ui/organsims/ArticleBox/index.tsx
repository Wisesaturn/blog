import { motion } from 'motion/react';

import ArticleTitle from '@/features/post/ui/molecules/ArticleTitle';
import ArticleTags from '@/features/post/ui/atoms/ArticleTags';
import { TOC } from '@/features/toc';
import useCodePen from '@/features/post/hooks/useCodePen';

import { IPost } from '@/entities/post';

interface ArticeBoxProps extends GlobalAnimation {
  post: IPost;
}

export default function ArticleBox({ post, animation }: ArticeBoxProps) {
  useCodePen();

  const { body, tags, ...rest } = post;

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
}
