import { MetaFunction, ShouldRevalidateFunction, useLoaderData } from 'react-router';

import { PostsPage } from '@/pages/posts';

import { getPosts } from '@/entities/post/index.server';

import formatHeadTags from '../../lib/formatHeadTags';

// meta
export const meta: MetaFunction = (args) => {
  const urlPrefix = 'posts';
  const title = 'Posts';
  return formatHeadTags({ urlPrefix, title, ...args });
};

/**
 * 검색과 카테고리, 정렬은 쿼리스트링만 바꾸므로 loader 를 다시 부르지 않는다.
 * 목록은 prerender 로 한 벌만 구워 두어, 다시 불러도 같은 `.data` 가 오고 요청만 낭비된다.
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentUrl,
  nextUrl,
  defaultShouldRevalidate,
}) => {
  if (currentUrl.pathname === nextUrl.pathname) return false;
  return defaultShouldRevalidate;
};

// loader
// 빌드 때 prerender 로 한 번 돈다 (#119). 쿼리스트링을 읽지 않아야 URL 과 무관하게 한 벌로 구워진다.
// 조회수는 목록 통계로 브라우저가 받는다
export async function loader() {
  return { posts: await getPosts() };
}

export default function Route() {
  const { posts } = useLoaderData<typeof loader>();
  return <PostsPage posts={posts} />;
}
