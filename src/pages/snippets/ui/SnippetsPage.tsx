import { motion } from 'motion/react';

import { type ISnippet } from '@/entities/snippet';

import { ANIMATE_FADE_UP_CONTAINER, ANIMATE_FADE_UP_ITEM } from '@/commons/config/animation';
import Title from '@/commons/ui/Title';

import SnippetList from './SnippetList';

interface SnippetsPageProps {
  snippets: Omit<ISnippet, 'body'>[];
}

/* -------------------------------------------------------------------------------------------------
 * SnippetsPage
 * 스니펫 목록. 숫자 없이 prerender 하고, 조회수는 화면을 그린 뒤 목록 통계로 받아 끼운다.
 * -----------------------------------------------------------------------------------------------*/
export default function SnippetsPage({ snippets }: SnippetsPageProps) {
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
      <SnippetList snippets={snippets} animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
    </motion.main>
  );
}
