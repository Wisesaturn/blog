import type { LoaderArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import PostCardSection from '@components/PostCard';
import getPosts from '@utils/api/getPosts';
import { Title } from '@components/Title';
import { json } from '@remix-run/node';
import type { CategoryType } from '@utils/constant/category';
import { CATEGORY_DATA } from '@utils/constant/category';

export async function loader({ params }: LoaderArgs) {
  const { post } = params;
  const category = CATEGORY_DATA.filter((ele: CategoryType) => {
    return ele.link === post;
  });

  console.log(category);
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
