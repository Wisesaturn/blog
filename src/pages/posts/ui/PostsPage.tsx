import { motion } from 'motion/react';
import { useMemo } from 'react';

import {
  Categories,
  filterPosts,
  parsePostsQuery,
  useUrlParamsUpdater,
} from '@/features/post-filter';

import { type IPost } from '@/entities/post';

import { ANIMATE_FADE_UP_CONTAINER, ANIMATE_FADE_UP_ITEM } from '@/commons/config/animation';
import Input from '@/commons/ui/Input';
import Title from '@/commons/ui/Title';

import PostList from './PostList';

interface PostsPageProps {
  posts: Omit<IPost, 'body'>[];
}

/* -------------------------------------------------------------------------------------------------
 * PostsPage
 * 글 목록. 쿼리스트링의 검색어, 카테고리, 정렬로 받은 목록을 걸러서 그린다.
 * -----------------------------------------------------------------------------------------------*/
export default function PostsPage({ posts }: PostsPageProps) {
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
