/**
 * `filterPosts` 는 목록 페이지의 검색과 카테고리 필터, 정렬을 클라이언트에서 한다.
 * loader 는 쿼리스트링을 읽지 않고 전체 목록을 주므로, 목록에 무엇이 보이는지는 전부 이 함수가 정한다.
 *
 * 세 가지를 막는다.
 * - 검색이 앞글자 매칭으로 돌아가는 것. Firestore 범위 쿼리를 쓰던 시절에는 '타입' 으로
 *   '함수 타입 선언하기' 를 찾지 못했다
 * - loader 가 준 원본 배열이 바뀌는 것. `sortPosts` 는 받은 배열을 제자리에서 정렬하는데,
 *   원본이 바뀌면 필터를 바꿀 때마다 앞선 정렬 결과가 남은 배열을 다시 걸러 순서가 조용히 어긋난다
 * - 쿼리스트링을 잘못 읽는 것. `/react` 리다이렉트가 `?category=react` 를 넘기므로 외부 링크가 이 형식에 묶여 있다
 */
import { describe, expect, it } from 'vitest';

import { type IPost } from '@/entities/post';

import filterPosts, { parsePostsQuery, type PostsQuery } from './filterPosts';

type PostRow = Omit<IPost, 'body'>;

function post(plainTitle: string, category: string, createdAt: string, views = 0): PostRow {
  return { plain_title: plainTitle, category, createdAt, views } as unknown as PostRow;
}

const TS_FUNC = post('함수 타입 선언하기', 'typescript', '2023. 6. 27.', 1600);
const REACT_HOOK = post('useLens 파헤치기', 'react', '2026. 7. 7.', 70);
const NEXT_CACHE = post('Next.js 캐시 전략', 'nextjs', '2025. 1. 10.', 300);
const ALL = [TS_FUNC, REACT_HOOK, NEXT_CACHE];

const query = (overrides: Partial<PostsQuery> = {}): PostsQuery => ({
  keyword: '',
  categories: [],
  orderBy: 'desc',
  ...overrides,
});

describe('검색은 제목의 어느 위치든 걸린다', () => {
  it('제목 가운데에 있는 단어로 찾는다', () => {
    expect(filterPosts(ALL, query({ keyword: '타입' }))).toEqual([TS_FUNC]);
  });

  it('대소문자를 가리지 않는다', () => {
    expect(filterPosts(ALL, query({ keyword: 'uselens' }))).toEqual([REACT_HOOK]);
  });

  it('앞뒤 공백은 무시한다', () => {
    expect(filterPosts(ALL, query({ keyword: '  캐시  ' }))).toEqual([NEXT_CACHE]);
  });

  it('검색어가 비면 전부 남긴다', () => {
    expect(filterPosts(ALL, query())).toHaveLength(3);
  });

  it('맞는 글이 없으면 빈 배열을 돌려준다', () => {
    expect(filterPosts(ALL, query({ keyword: '없는단어' }))).toEqual([]);
  });
});

describe('카테고리는 고른 것 중 하나에 속하면 남긴다', () => {
  it('하나를 고르면 그 카테고리만 남긴다', () => {
    expect(filterPosts(ALL, query({ categories: ['react'] }))).toEqual([REACT_HOOK]);
  });

  it('여럿을 고르면 합집합이다', () => {
    const result = filterPosts(ALL, query({ categories: ['react', 'typescript'] }));
    expect(result).toEqual([REACT_HOOK, TS_FUNC]);
  });

  it('검색어와 함께 쓰면 둘 다 맞아야 남는다', () => {
    expect(filterPosts(ALL, query({ keyword: '타입', categories: ['react'] }))).toEqual([]);
  });
});

describe('정렬은 조건을 건 뒤에 한다', () => {
  it('mostView 면 조회수가 높은 순이다', () => {
    const result = filterPosts(ALL, query({ orderBy: 'mostView' }));
    expect(result.map((p) => p.views)).toEqual([1600, 300, 70]);
  });

  it('asc 면 오래된 글이 앞이다', () => {
    const result = filterPosts(ALL, query({ orderBy: 'asc' }));
    expect(result).toEqual([TS_FUNC, NEXT_CACHE, REACT_HOOK]);
  });
});

describe('loader 가 준 원본 배열은 바뀌지 않는다', () => {
  it('정렬해도 원본의 순서가 그대로다', () => {
    const origin = [TS_FUNC, REACT_HOOK, NEXT_CACHE];

    filterPosts(origin, query({ orderBy: 'mostView' }));
    filterPosts(origin, query({ orderBy: 'asc' }));

    expect(origin).toEqual([TS_FUNC, REACT_HOOK, NEXT_CACHE]);
  });

  it('조건이 없어도 새 배열을 돌려준다', () => {
    expect(filterPosts(ALL, query())).not.toBe(ALL);
  });
});

describe('parsePostsQuery 는 목록 URL 의 쿼리스트링을 조건으로 읽는다', () => {
  it.each([
    ['', { keyword: '', categories: [], orderBy: 'desc' }],
    ['category=react', { keyword: '', categories: ['react'], orderBy: 'desc' }],
    ['category=react,nextjs', { keyword: '', categories: ['react', 'nextjs'], orderBy: 'desc' }],
    ['keyword=%ED%83%80%EC%9E%85', { keyword: '타입', categories: [], orderBy: 'desc' }],
    ['orderby=mostView', { keyword: '', categories: [], orderBy: 'mostView' }],
    // 예전에는 모르는 값을 그대로 넘겨서 정렬 드롭다운이 아무것도 선택하지 않은 채로 보였다
    ['orderby=foo', { keyword: '', categories: [], orderBy: 'desc' }],
  ])('%s', (search, expected) => {
    expect(parsePostsQuery(new URLSearchParams(search))).toEqual(expected);
  });

  it('카테고리 사이의 빈 값은 버린다', () => {
    expect(parsePostsQuery(new URLSearchParams('category=react,,nextjs,')).categories).toEqual([
      'react',
      'nextjs',
    ]);
  });
});
