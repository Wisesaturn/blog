import { motion } from 'framer-motion';

import { IPost } from '$features/post/types/post';
import PostFilter from '$features/post/ui/molecules/PostFilter';

interface PostListProps extends GlobalAnimation {
  posts: IPost[];
}

export default function PostList(props: PostListProps) {
  const { animation, posts } = props;

  return (
    <div className="pt-10">
      <PostFilter animation={{ variants: animation?.variants }} />
      <motion.div variants={animation?.variants}>
        {posts.map((post, idx) => (
          <div key={idx}>{post.title}</div>
        ))}
      </motion.div>
    </div>
  );
}
