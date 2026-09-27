import { motion } from 'motion/react';

import { ISnippet } from '@/entities/snippet';

import SnippetTitle from './SnippetTitle';

interface SnippetBoxProps extends GlobalAnimation {
  /** 조회수는 통계 API 에서 받는다. 받는 중이면 `undefined`, 받지 못하면 `null` */
  snippet: Omit<ISnippet, 'views'> & { views: number | null | undefined };
}

export default function SnippetBox({ snippet, animation }: SnippetBoxProps) {
  const { body, ...rest } = snippet;

  return (
    <>
      <SnippetTitle {...rest} animation={{ variants: animation?.variants }} />
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
