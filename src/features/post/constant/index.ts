import { CATEGORY_DATA } from '$shared/constant/category';

import { PostsFilter, PostsOrderBy } from '../types/post';

/* eslint-disable import/prefer-default-export */
export const POST_SORT_FILTER = ['최신순', '오래된순', '조회수'];
export const POST_SORT_ORDER_BY = ['desc', 'asc', 'mostView'];

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

export const DEFAULT_THUMBNAIL =
  'https://user-images.githubusercontent.com/79848632/220535309-f7a02b94-5eab-46bf-867c-8c9c82475620.png';
export const DEFAULT_DESCRIPTION = `꾸준히 성장하고 싶은 프론트엔드 엔지니어입니다. 저만의 경험과 기록을 담아두었습니다 | Error ${CATEGORY_DATA.map(
  (category) => category.name,
).join(' ')}`;
