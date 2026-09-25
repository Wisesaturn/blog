import { useMemo } from 'react';
import {
  HeadersFunction,
  data,
  MetaFunction,
  ShouldRevalidateFunction,
  useLoaderData,
} from 'react-router';
import { motion } from 'motion/react';

import {
  useUrlParamsUpdater,
  filterPosts,
  parsePostsQuery,
  Categories,
} from '@/features/post-filter';
import PostList from '@/features/post/ui/organsims/PostList';

import { getPosts } from '@/entities/post/index.server';

import Input from '@/commons/ui/Input';
import Title from '@/commons/ui/Title';
import { LIST_CACHE_CONTROL } from '@/commons/config/cache';
import { ANIMATE_FADE_UP_CONTAINER, ANIMATE_FADE_UP_ITEM } from '@/commons/config/animation';

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

// page
export default function PostsPage() {
  const { posts } = useLoaderData<typeof loader>();
  const { searchParams, setSelectedParams } = useUrlParamsUpdater();
  const visiblePosts = useMemo(
    () => filterPosts(posts, parsePostsQuery(searchParams)),
    [posts, searchParams],
  );

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
      <PostList posts={visiblePosts} animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
    </motion.main>
  );
}
