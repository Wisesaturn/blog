import { motion } from 'motion/react';
import { useParams } from 'react-router';

import { ArticleComments } from '@/features/comments';
import { useViewCount } from '@/features/view-count';

import { type IPost, postQueries } from '@/entities/post';

import { ANIMATE_FADE_UP_CONTAINER, ANIMATE_FADE_UP_ITEM } from '@/commons/config/animation';

import ArticleBox from './ArticleBox';
import ArticleButtons from './ArticleButtons';

interface PostDetailPageProps {
  post: IPost;
}

/* -------------------------------------------------------------------------------------------------
 * PostDetailPage
 * 글 상세. 본문, 목록·공유 버튼, 댓글을 그리고 조회수를 올린다.
 * -----------------------------------------------------------------------------------------------*/
export default function PostDetailPage({ post }: PostDetailPageProps) {
  const { category = '', title = '' } = useParams();
  const views = useViewCount(postQueries.views(category, title), post.views || 0);

  return (
    <motion.main
      initial="hidden"
      animate="show"
      variants={ANIMATE_FADE_UP_CONTAINER}
      className="layout min-h-screen"
    >
      <ArticleBox post={{ ...post, views }} animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
      <ArticleButtons animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
      <ArticleComments animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
    </motion.main>
  );
}
