import { type POST_SORT_FILTER, type POST_SORT_ORDER_BY } from '../constant';

export type PostsOrderBy = (typeof POST_SORT_ORDER_BY)[number];
export type PostsFilter = (typeof POST_SORT_FILTER)[number];
