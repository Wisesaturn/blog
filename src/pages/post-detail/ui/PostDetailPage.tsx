import { motion } from 'motion/react';
import { useParams } from 'react-router';

import { ArticleComments } from '@/features/comments';
import { LikeButton, useLike } from '@/features/like';
import { useContentStats } from '@/features/view-count';

import { type IPost } from '@/entities/post';

import { ANIMATE_FADE_UP_CONTAINER, ANIMATE_FADE_UP_ITEM } from '@/commons/config/animation';

import ArticleBox from './ArticleBox';
import ArticleButtons from './ArticleButtons';

interface PostDetailPageProps {
  post: IPost;
}

/* -------------------------------------------------------------------------------------------------
 * PostDetailPage
 * 글 상세. 본문, 좋아요, 목록·공유 버튼, 댓글을 그리고 조회수를 올린다.
 * -----------------------------------------------------------------------------------------------*/
export default function PostDetailPage({ post }: PostDetailPageProps) {
  const { category = '', title = '' } = useParams();
  const { views } = useContentStats('post', `${category}/${title}`);
  // 버튼이 둘이라 훅은 한 번만 부르고 같은 값을 넘긴다. 따로 부르면 모으는 클릭 수가 따로 논다
  const { likes, like } = useLike('post', `${category}/${title}`);

  return (
    <motion.main
      initial="hidden"
      animate="show"
      variants={ANIMATE_FADE_UP_CONTAINER}
      className="layout min-h-screen"
    >
      <ArticleBox
        post={{ ...post, views }}
        likeSlot={<LikeButton likes={likes} onLike={like} />}
        animation={{ variants: ANIMATE_FADE_UP_ITEM }}
      />
      <motion.div variants={ANIMATE_FADE_UP_ITEM}>
        <LikeButton likes={likes} onLike={like} size="lg" />
      </motion.div>
      <ArticleButtons animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
      <ArticleComments animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
    </motion.main>
  );
}
