import { motion } from 'framer-motion';

import { IPost, PostsOrderBy } from '$features/post/types/post';
import PostFilter from '$features/post/ui/molecules/PostFilter';
import useUrlParamsUpdater from '$features/post/hooks/useUrlParamsUpdater';
import sortPosts from '$features/post/lib/sortPosts';
import PostRow from '$features/post/ui/molecules/PostRow';

import PostEmptyRow from '../../atoms/PostEmptyRow';

interface PostListProps extends GlobalAnimation {
  posts: IPost[];
}

export default function PostList(props: PostListProps) {
  const { animation, posts } = props;
  const { searchParams } = useUrlParamsUpdater();

  const sortedPosts = sortPosts(posts, searchParams.get('orderby') as PostsOrderBy);

  return (
    <div className="relative pt-10 top-0">
      <PostFilter animation={{ variants: animation?.variants }} />
      <motion.div className="pt-12 max-md:pt-10 flex gap-2 flex-col" variants={animation?.variants}>
        {sortedPosts.length > 0 && sortedPosts.map((post, idx) => <PostRow key={idx} {...post} />)}
        {sortedPosts.length === 0 && <PostEmptyRow />}
      </motion.div>
    </div>
  );
}
