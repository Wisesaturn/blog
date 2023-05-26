import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';

import PostCardSection from '@components/PostCard';
import { Title } from '@components/Title';

import getPosts from '@utils/api/getPosts';
import { CATEGORY_DATA } from '@utils/constant/category';
import type { CategoryType } from '@utils/constant/category';

import type { LoaderArgs } from '@remix-run/node';

export async function loader({ params }: LoaderArgs) {
  const { post } = params;
  const category = CATEGORY_DATA.filter((ele: CategoryType) => {
    return ele.link === post;
  });

  const data = await getPosts(post!);
  return json({ category: category[0].name, data });
}
export const ReviewPage = () => {
  const load = useLoaderData();

  return (
    <>
      <Title isContent={load.category} />
      <PostCardSection data={load.data} />
    </>
  );
};

export default ReviewPage;
