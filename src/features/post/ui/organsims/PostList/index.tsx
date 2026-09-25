import { motion } from 'motion/react';

import PostFilter from '@/features/post/ui/molecules/PostFilter';
import PostEmptyRow from '@/features/post/ui/atoms/PostEmptyRow';

import { IPost, PostRow } from '@/entities/post';

interface PostListProps extends GlobalAnimation {
  posts: Omit<IPost, 'body'>[];
}

export default function PostList(props: PostListProps) {
  const { animation, posts } = props;

  return (
    <div className="relative pt-10 top-0">
      <PostFilter animation={{ variants: animation?.variants }} />
      <motion.div className="pt-12 flex gap-2 flex-col" variants={animation?.variants}>
        {posts.length > 0 && posts.map((post) => <PostRow key={post.index} {...post} />)}
        {posts.length === 0 && <PostEmptyRow />}
      </motion.div>
    </div>
  );
}
