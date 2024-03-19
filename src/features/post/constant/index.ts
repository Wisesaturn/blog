import { PostsFilter, PostsOrderBy } from '../types/post';

/* eslint-disable import/prefer-default-export */
export const POST_SORT_FILTER = ['최신순', '오래된순', '조회수'] as const;
export const POST_SORT_ORDER_BY = ['desc', 'asc', 'mostView'] as const;

export const SORT_FILTER_MAP: Record<PostsFilter, PostsOrderBy> = {
  최신순: 'desc',
  오래된순: 'asc',
  조회수: 'mostView',
};
