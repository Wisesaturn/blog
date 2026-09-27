import { PostsFilter, PostsOrderBy } from '../model/types';

export const POST_SORT_FILTER = ['최신순', '오래된순', '조회수'] as const;
export const POST_SORT_ORDER_BY = ['desc', 'asc', 'mostView'] as const;

/** 목록 통계(조회수)를 받아야 고를 수 있는 정렬. 받기 전에는 드롭다운에서 스피너로 보인다 (#119) */
export const VIEW_SORT_FILTER: readonly PostsFilter[] = ['조회수'];

export const POST_FILTER_TO_ORDER_BY: Record<PostsFilter, PostsOrderBy> = {
  최신순: 'desc',
  오래된순: 'asc',
  조회수: 'mostView',
};

export const ORDER_BY_TO_POST_FILTER: Record<PostsOrderBy, PostsFilter> = {
  desc: '최신순',
  asc: '오래된순',
  mostView: '조회수',
};
