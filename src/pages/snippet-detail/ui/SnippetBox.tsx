import { motion } from 'motion/react';

import { ISnippet } from '@/entities/snippet';

import SnippetTitle from './SnippetTitle';

interface SnippetBoxProps extends GlobalAnimation {
  snippet: ISnippet;
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
          className="markdown-body w-full"
          dangerouslySetInnerHTML={{ __html: body }}
        />
      </motion.div>
    </>
  );
}
