import type { LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import PostCardSection from '@components/Section/PostCard';
import getPosts from '@utils/api/getPosts';

export const loader: LoaderFunction = () => {
  return getPosts('review');
};

export const ReviewPage = () => {
  const posts = useLoaderData();

  return <PostCardSection data={posts} />;
};

export default ReviewPage;
