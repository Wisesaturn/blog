import sortPosts from './sortPosts';
import { type IPost, type PostsOrderBy } from '../types/post';

type PostRow = Omit<IPost, 'body'>;

export interface PostsQuery {
  keyword: string;
  categories: string[];
  orderBy: PostsOrderBy;
}

/**
 * @description 목록 페이지의 쿼리스트링을 검색·필터·정렬 조건으로 읽는다
 * @param searchParams 목록 URL 의 쿼리스트링
 * @returns 검색어, 카테고리 목록, 정렬 기준
 * @example
 * parsePostsQuery(new URLSearchParams('category=react,nextjs&orderby=mostView'));
 * // { keyword: '', categories: ['react', 'nextjs'], orderBy: 'mostView' }
 */
export function parsePostsQuery(searchParams: URLSearchParams): PostsQuery {
  const category = searchParams.get('category');

  return {
    keyword: searchParams.get('keyword') ?? '',
    categories: category ? category.split(',').filter(Boolean) : [],
    orderBy: (searchParams.get('orderby') as PostsOrderBy) || 'desc',
  };
}

/**
 * @description 전체 글 목록에 검색어와 카테고리를 걸고 정렬한 새 배열을 돌려준다
 * @param posts loader 가 준 전체 글 목록. 바꾸지 않는다
 * @param query `parsePostsQuery` 가 읽은 조건
 * @returns 조건에 맞는 글만 담아 정렬한 새 배열
 */
export default function filterPosts(posts: PostRow[], query: PostsQuery): PostRow[] {
  const keyword = query.keyword.trim().toLowerCase();

  const matched = posts.filter((post) => {
    if (query.categories.length > 0 && !query.categories.includes(post.category)) return false;
    if (!keyword) return true;
    return post.plain_title.toLowerCase().includes(keyword);
  });

  // `sortPosts` 는 받은 배열을 제자리에서 정렬한다. `filter` 가 이미 새 배열을 만들었으므로
  // loader 가 준 원본은 건드리지 않는다
  return sortPosts(matched, query.orderBy);
}
