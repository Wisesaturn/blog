import { motion } from 'motion/react';
import Giscus from '@giscus/react';

import useDarkmode from '@/commons/model/useDarkmode';

export default function SnippetComments(props: GlobalAnimation) {
  const darkmode = useDarkmode();

  return (
    <motion.div className="pt-20" variants={props.animation?.variants}>
      <Giscus
        repo="wisesaturn/blog"
        repoId="R_kgDOHa92pA"
        category="Snippets Comments"
        categoryId="DIC_kwDOHa92pM4CeIrA"
        mapping="title"
        term={`Snippets comments`}
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        theme={darkmode}
        lang="ko"
      />
    </motion.div>
  );
}
