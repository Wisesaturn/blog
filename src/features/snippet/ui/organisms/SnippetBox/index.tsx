import { Suspense } from 'react';
import { Await } from '@remix-run/react';
import { motion } from 'framer-motion';

import SnippetTitle from '$features/snippet/ui/molecules/SnippetTitle';
import { ISnippet } from '$features/snippet/types/snippet';

import SnippetSkeleton from '$shared/ui/molecules/Skeleton/SnippetSkeleton';

interface SnippetBoxProps extends GlobalAnimation {
  snippet: Promise<ISnippet>;
}

export default function SnippetBox({ snippet, animation }: SnippetBoxProps) {
  return (
    <Suspense fallback={<SnippetSkeleton />}>
      <Await resolve={snippet}>
        {(resolvedSnippet) => {
          const { body, ...rest } = resolvedSnippet;
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
        }}
      </Await>
    </Suspense>
  );
}
