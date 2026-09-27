import { motion } from 'motion/react';

import { PostFilter } from '@/features/post-filter';
import { type StatState } from '@/features/view-count';

import { IPost, PostRow, postStatKey } from '@/entities/post';

import PostEmptyRow from './PostEmptyRow';

interface PostListProps extends GlobalAnimation {
  posts: Omit<IPost, 'body'>[];
  /** 글의 조회수. 목록 통계에서 찾는다 */
  viewsFor: (post: Omit<IPost, 'body'>) => StatState;
  /** 글의 좋아요 수. 목록 통계에서 찾는다 */
  likesFor: (post: Omit<IPost, 'body'>) => StatState;
  /** 목록 통계를 받았는지. 받기 전에는 조회순을 고를 수 없다 */
  viewsReady: boolean;
}

export default function PostList(props: PostListProps) {
  const { animation, posts, viewsFor, likesFor, viewsReady } = props;

  return (
    <div className="relative pt-10 top-0">
      <PostFilter viewsReady={viewsReady} animation={{ variants: animation?.variants }} />
      <motion.div className="pt-12 flex gap-2 flex-col" variants={animation?.variants}>
        {posts.length > 0 &&
          posts.map((post) => (
            // index(Notion 페이지 ID)는 같은 페이지를 다른 카테고리에 다시 발행하면 겹친다. 경로 키는 겹치지 않는다
            <PostRow
              key={postStatKey(post)}
              {...post}
              views={viewsFor(post)}
              likes={likesFor(post)}
            />
          ))}
        {posts.length === 0 && <PostEmptyRow />}
      </motion.div>
    </div>
  );
}
