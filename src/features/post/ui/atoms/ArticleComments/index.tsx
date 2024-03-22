import { motion } from 'framer-motion';
import Giscus from '@giscus/react';

import useLayout from '$shared/hooks/useLayout';

export default function ArticleComments(props: GlobalAnimation) {
  const { layout } = useLayout();

  return (
    <motion.div className="pt-20" variants={props.animation?.variants}>
      <Giscus
        repo="wisesaturn/blog"
        repoId="R_kgDOHa92pA"
        category="Posts Comments"
        categoryId="DIC_kwDOHa92pM4CeIrA"
        mapping="title"
        term="Welcome to @giscus/react component!"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        theme={layout.darkmode}
        lang="ko"
      />
    </motion.div>
  );
}
