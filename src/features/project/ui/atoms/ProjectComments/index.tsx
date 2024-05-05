import { motion } from 'framer-motion';
import Giscus from '@giscus/react';

import useLayout from '$shared/hooks/useLayout';

export default function ProjectComments(props: GlobalAnimation) {
  const { layout } = useLayout();

  return (
    <motion.div className="pt-20" variants={props.animation?.variants}>
      <Giscus
        repo="wisesaturn/blog"
        repoId="R_kgDOHa92pA"
        category="Projects Comments"
        categoryId="DIC_kwDOHa92pM4CeIrA"
        mapping="title"
        term={`Projects comments`}
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        theme={layout.darkmode}
        lang="ko"
      />
    </motion.div>
  );
}
