import { motion } from 'motion/react';
import { useParams } from 'react-router';

import { SnippetComments } from '@/features/comments';
import { useViewCount } from '@/features/view-count';

import { type ISnippet, snippetQueries } from '@/entities/snippet';

import { ANIMATE_FADE_UP_CONTAINER, ANIMATE_FADE_UP_ITEM } from '@/commons/config/animation';

import SnippetBox from './SnippetBox';
import SnippetButtons from './SnippetButtons';

interface SnippetDetailPageProps {
  snippet: ISnippet;
}

/* -------------------------------------------------------------------------------------------------
 * SnippetDetailPage
 * 스니펫 상세. 본문, 목록·공유 버튼, 댓글을 그리고 조회수를 올린다.
 * -----------------------------------------------------------------------------------------------*/
export default function SnippetDetailPage({ snippet }: SnippetDetailPageProps) {
  const { title = '' } = useParams();
  const views = useViewCount(snippetQueries.views(title), snippet.views || 0);

  return (
    <motion.main
      initial="hidden"
      animate="show"
      variants={ANIMATE_FADE_UP_CONTAINER}
      className="layout min-h-screen"
    >
      <SnippetBox snippet={{ ...snippet, views }} animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
      <SnippetButtons animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
      <SnippetComments animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
    </motion.main>
  );
}
