import { motion } from 'framer-motion';
import { ActionFunction, LoaderFunctionArgs, MetaFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import qs from 'qs';

import PostList from '$features/post/ui/organsims/PostList';
import Categories from '$features/post/ui/molecules/Categories';
import useUrlParamsUpdater from '$features/post/hooks/useUrlParamsUpdater';
import getPosts from '$features/post/api/getPosts';
import { PostsOrderBy } from '$features/post/types/post';
import sortPosts from '$features/post/lib/sortPosts';

import Input from '$shared/ui/molecules/Input';
import Title from '$shared/ui/atoms/Title';
import { ANIMATE_FADE_UP_CONTAINER, ANIMATE_FADE_UP_ITEM } from '$shared/constant/animation';
import formatHeadTags from '$shared/lib/formatHeadTags';

// meta
export const meta: MetaFunction = (args) => {
  const urlPrefix = 'posts';
  const title = '사툰사툰 :: Posts';
  return formatHeadTags({ urlPrefix, title, ...args });
};

// action (refresh post callback)
export const action: ActionFunction = async () => json({ refetch: true });

// loader
export async function loader({ request }: LoaderFunctionArgs) {
  const params = qs.parse(request.url.split('?')[1]);
  const searchParams = {
    keyword: String(params.keyword || ''),
    categories: params.category ? String(params.category).split(',') : [],
  };
  const posts = await getPosts(searchParams);
  const sortedPosts = sortPosts(posts, params.orderby as PostsOrderBy);

  return json(
    { posts: sortedPosts },
    {
      headers: {
        'Cache-Control': 'public, stale-while-revalidate=31556952',
      },
    },
  );
}

// page
export default function PostsPage() {
  const { posts } = useLoaderData<typeof loader>();
  const { searchParams, setSelectedParams } = useUrlParamsUpdater();

  return (
    <motion.main
      initial="hidden"
      animate="show"
      variants={ANIMATE_FADE_UP_CONTAINER}
      className="layout min-h-screen"
    >
      <Title
        animation={{
          variants: ANIMATE_FADE_UP_ITEM,
        }}
        title="Post"
        subtitle="문제를 해결하며 얻은 경험들을 담은 공간입니다"
      />
      <Input
        inputType="search"
        className="my-4"
        placeholder="검색어를 입력하세요"
        initialValue={searchParams.get('keyword') || ''}
        animation={{ variants: ANIMATE_FADE_UP_ITEM }}
        handleEsc={() => setSelectedParams('keyword', '', false)}
        handleSearch={(_v) => setSelectedParams('keyword', _v, false)}
      />
      <Categories animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
      <PostList posts={posts} animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
    </motion.main>
  );
}
