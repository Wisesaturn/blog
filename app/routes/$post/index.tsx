import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';

import PostCardSection from '@components/PostCard';
import { Title } from '@components/Title';
import Button from '@components/Button';

import fetchNotionPosts from '@utils/api/fetchNotionPosts';
import { CATEGORY_DATA } from '@utils/constant/category';
import type { CategoryType } from '@utils/constant/category';
import searchDB from '@utils/api/searchDB';

import type { LoaderArgs } from '@remix-run/node';

export async function loader({ params, request }: LoaderArgs) {
  const { post } = params;
  const url = new URL(request.url);
  const refetch = url.searchParams.get('refetch');
  const category = CATEGORY_DATA.filter((ele: CategoryType) => {
    return ele.link === post;
  });

  if (post === undefined) {
    throw new Error('Wrong Path');
  }

  if (refetch) {
    await fetchNotionPosts(post);
  }

  const data = await searchDB(post);

  return json({ category: category[0].name, data, post: String(post) });
}

export const SelectedPostPage = () => {
  const { category, data, post } = useLoaderData();

  const updatePost = async () => {
    window.location.href = `${post}?refetch=true`;
    window.location.replace(`${post}`);
  };

  return (
    <>
      <Title isContent={category} />
      {process.env.NODE_ENV === 'development' && (
        <Button
          onClick={updatePost}
          className="w-full bg-gray-700 text-white hover:bg-gray-800 active:bg-gray-900"
          content="새로고침"
        />
      )}
      <PostCardSection data={data} />
    </>
  );
};

export default SelectedPostPage;
