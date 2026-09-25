import {
  HeadersFunction,
  data,
  MetaFunction,
  ShouldRevalidateFunction,
  useLoaderData,
} from 'react-router';

import { PostsPage } from '@/pages/posts';

import { getPosts } from '@/entities/post/index.server';

import { LIST_CACHE_CONTROL } from '@/commons/config/cache';

import formatHeadTags from '../../lib/formatHeadTags';

// meta
export const meta: MetaFunction = (args) => {
  const urlPrefix = 'posts';
  const title = 'Posts';
  return formatHeadTags({ urlPrefix, title, ...args });
};

/**
 * loader 가 `data()` 에 넣은 헤더는 이 export 가 있어야 문서 응답과 `.data` 응답에 실린다.
 * 없으면 `Cache-Control` 이 빠져 CDN 이 캐시하지 않는다.
 */
export const headers: HeadersFunction = ({ loaderHeaders }) => loaderHeaders;

/**
 * 검색과 카테고리, 정렬은 쿼리스트링만 바꾸므로 loader 를 다시 부르지 않는다.
 * 다시 부르면 조건마다 다른 `.data` URL 로 요청이 나가 CDN 캐시가 갈라진다.
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
// 쿼리스트링을 읽지 않는다. 응답이 URL 과 무관하게 한 벌이어야 CDN 이 하나로 캐시한다
export async function loader() {
  const posts = await getPosts();

  return data(
    { posts },
    {
      headers: { 'Cache-Control': LIST_CACHE_CONTROL },
    },
  );
}

export default function Route() {
  const { posts } = useLoaderData<typeof loader>();
  return <PostsPage posts={posts} />;
}
