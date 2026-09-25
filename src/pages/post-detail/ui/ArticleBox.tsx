import { motion } from 'motion/react';

import { TOC } from '@/features/toc';

import { IPost } from '@/entities/post';

import ArticleTitle from './ArticleTitle';
import ArticleTags from './ArticleTags';
import useCodePen from '../model/useCodePen';

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
          className="markdown-body w-full min-w-0 pt-10 md:max-w-[768px] md:flex-1"
          dangerouslySetInnerHTML={{ __html: body }}
        />
        <TOC body={body} />
      </motion.div>
      <ArticleTags tags={tags} animation={{ variants: animation?.variants }} />
    </>
  );
}
