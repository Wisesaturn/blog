import { motion } from 'motion/react';
import { type ReactNode } from 'react';

import { ISnippet } from '@/entities/snippet';

import SnippetTitle from './SnippetTitle';

interface SnippetBoxProps extends GlobalAnimation {
  /** 제목 정보 줄 오른쪽에 두는 좋아요 버튼 */
  likeSlot?: ReactNode;
  /** 조회수는 통계 API 에서 받는다. 받는 중이면 `undefined`, 받지 못하면 `null` */
  snippet: Omit<ISnippet, 'views'> & { views: number | null | undefined };
}

export default function SnippetBox({ snippet, animation, likeSlot }: SnippetBoxProps) {
  const { body, ...rest } = snippet;

  return (
    <>
      <SnippetTitle {...rest} likeSlot={likeSlot} animation={{ variants: animation?.variants }} />
      <motion.div
        variants={animation?.variants}
        className="flex w-full max-w-layout max-md:flex-col-reverse"
      >
        <motion.article
          variants={animation?.variants}
          className="markdown-body w-full pt-10"
          dangerouslySetInnerHTML={{ __html: body }}
        />
      </motion.div>
    </>
  );
}
