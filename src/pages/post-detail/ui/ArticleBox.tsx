import { motion } from 'motion/react';
import { type ReactNode } from 'react';

import { TOC } from '@/features/toc';

import { IPost } from '@/entities/post';

import ArticleTitle from './ArticleTitle';
import ArticleTags from './ArticleTags';
import useCodePen from '../model/useCodePen';

interface ArticeBoxProps extends GlobalAnimation {
  /** 제목 정보 줄에서 조회수 바로 옆에 두는 좋아요 버튼 */
  likeSlot?: ReactNode;
  /** 조회수는 통계 API 에서 받는다. 받는 중이면 `undefined`, 받지 못하면 `null` */
  post: Omit<IPost, 'views'> & { views: number | null | undefined };
}

export default function ArticleBox({ post, animation, likeSlot }: ArticeBoxProps) {
  useCodePen();

  const { body, tags, ...rest } = post;

  return (
    <>
      <ArticleTitle {...rest} likeSlot={likeSlot} animation={{ variants: animation?.variants }} />
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
