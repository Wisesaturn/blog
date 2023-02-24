import type { LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import PostCardSection from '@components/PostCard';
import getPosts from '@utils/api/getPosts';
import { Title } from '@components/Title';

export const loader: LoaderFunction = () => {
  return getPosts('review');
};

export const ReviewPage = () => {
  const posts = useLoaderData();

  return (
    <>
      <Title isContent="🛠 회고" />
      <PostCardSection data={posts} />
    </>
  );
};

export default ReviewPage;
