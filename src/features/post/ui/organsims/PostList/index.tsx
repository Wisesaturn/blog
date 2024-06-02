import { motion } from 'framer-motion';
import { Suspense } from 'react';
import { Await } from '@remix-run/react';

import { IPost } from '$features/post/types/post';
import PostFilter from '$features/post/ui/molecules/PostFilter';
import PostRow from '$features/post/ui/molecules/PostRow';
import PostEmptyRow from '$features/post/ui/atoms/PostEmptyRow';

import PostListSkeleton from '$shared/ui/molecules/Skeleton/PostListSkeleton';

interface PostListProps extends GlobalAnimation {
  posts: Promise<Omit<IPost, 'body'>[]>;
}

export default function PostList(props: PostListProps) {
  const { animation, posts } = props;

  return (
    <div className="relative pt-10 top-0">
      <PostFilter animation={{ variants: animation?.variants }} />
      <motion.div className="pt-12 flex gap-2 flex-col" variants={animation?.variants}>
        <Suspense fallback={<PostListSkeleton />}>
          <Await resolve={posts}>
            {(resolvedPosts) => (
              <>
                {resolvedPosts.length > 0 &&
                  resolvedPosts.map((post) => <PostRow key={post.index} {...post} />)}
                {resolvedPosts.length === 0 && <PostEmptyRow />}
              </>
            )}
          </Await>
        </Suspense>
      </motion.div>
    </div>
  );
}
