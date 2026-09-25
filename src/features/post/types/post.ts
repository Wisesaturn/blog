import { type z } from 'zod';

import { type POST_SORT_FILTER, type POST_SORT_ORDER_BY } from '../constant';
import { type postDocument } from '../model/postDocument';

export type IPost = z.infer<typeof postDocument>;

export type PostsOrderBy = (typeof POST_SORT_ORDER_BY)[number];
export type PostsFilter = (typeof POST_SORT_FILTER)[number];
