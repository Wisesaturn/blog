import { motion } from 'framer-motion';
import Giscus from '@giscus/react';

import useLayout from '$shared/hooks/useLayout';

export default function SnippetComments(props: GlobalAnimation) {
  const { layout } = useLayout();

  return (
    <motion.div className="pt-20" variants={props.animation?.variants}>
      <Giscus
        repo="wisesaturn/blog"
        repoId="R_kgDOHa92pA"
        category="Snippets Comments"
        categoryId="DIC_kwDOHa92pM4CeIrA"
        mapping="title"
        term={`${layout.header.title || 'jaehan.blog'} comments`}
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        theme={layout.darkmode}
        lang="ko"
      />
    </motion.div>
  );
}
