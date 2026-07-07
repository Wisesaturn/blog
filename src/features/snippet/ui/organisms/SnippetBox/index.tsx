import { motion } from 'framer-motion';

import SnippetTitle from '$features/snippet/ui/molecules/SnippetTitle';
import { ISnippet } from '$features/snippet/types/snippet';

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
