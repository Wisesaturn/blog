import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';

import PostCardSection from '@components/PostCard';
import { Title } from '@components/Title';

import fetchNotionPosts from '@utils/api/fetchNotionPosts';
import { CATEGORY_DATA } from '@utils/constant/category';
import type { CategoryType } from '@utils/constant/category';
import saveImageIntoFirebase from '@utils/lib/saveImageIntoFirebase';

import type { LoaderArgs } from '@remix-run/node';

export async function loader({ params }: LoaderArgs) {
  const { post } = params;
  const category = CATEGORY_DATA.filter((ele: CategoryType) => {
    return ele.link === post;
  });

  saveImageIntoFirebase('22');

  if (post === undefined) {
    throw new Error('Wrong Path');
  }

  const data = await fetchNotionPosts(post);
  return json({ category: category[0].name, data });
}
export const SelectedPostPage = () => {
  const { category, data } = useLoaderData();

  return (
    <>
      <Title isContent={category} />
      <PostCardSection data={data} />
    </>
  );
};

export default SelectedPostPage;
