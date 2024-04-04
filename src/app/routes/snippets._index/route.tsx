import { motion } from 'framer-motion';
import { MetaFunction } from '@remix-run/node';

import SnippetCreater from '$features/snippet/ui/molecules/SnippetCreater';

import { ANIMATE_FADE_UP_CONTAINER, ANIMATE_FADE_UP_ITEM } from '$shared/constant/animation';
import Title from '$shared/ui/atoms/Title';
import formatHeadTags from '$shared/lib/formatHeadTags';

// meta
export const meta: MetaFunction = (args) => {
  const urlPrefix = 'snippets';
  return formatHeadTags({ urlPrefix, ...args });
};

export default function SnippetsPage() {
  return (
    <motion.main
      initial="hidden"
      animate="show"
      variants={ANIMATE_FADE_UP_CONTAINER}
      className="layout min-h-screen"
    >
      <Title
        animation={{
          variants: ANIMATE_FADE_UP_ITEM,
        }}
        title="Code Snippets"
        subtitle="실제로 유용했던 코드 조각들을 모아두었습니다"
      />
      <SnippetCreater animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
    </motion.main>
  );
}
