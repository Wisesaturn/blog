import { motion } from 'framer-motion';

import { IPost, PostsOrderBy } from '$features/post/types/post';
import PostFilter from '$features/post/ui/molecules/PostFilter';
import useUrlParamsUpdater from '$features/post/hooks/useUrlParamsUpdater';
import sortPosts from '$features/post/lib/sortPosts';

interface PostListProps extends GlobalAnimation {
  posts: IPost[];
}

export default function PostList(props: PostListProps) {
  const { animation, posts } = props;
  const { searchParams } = useUrlParamsUpdater();

  const sortedPosts = sortPosts(posts, searchParams.get('orderby') as PostsOrderBy);

  return (
    <div className="pt-10">
      <PostFilter animation={{ variants: animation?.variants }} />
      <motion.div variants={animation?.variants}>
        {sortedPosts.map((post, idx) => (
          <div key={idx}>{post.title}</div>
        ))}
      </motion.div>
    </div>
  );
}
