import { POST_SORT_FILTER, POST_SORT_ORDER_BY } from '../constant';

export interface ITag {
  color: string;
  id: string;
  name: string;
}

export interface IPost {
  body: string;
  category: string;
  createdAt: string;
  description: string;
  index: string;
  lastmod: string;
  last_editedAt: Date | string;
  plain_title: string;
  tags: ITag[];
  thumbnail: string;
  title: string;
  views: number;
}

export type PostsOrderBy = (typeof POST_SORT_ORDER_BY)[number];
export type PostsFilter = (typeof POST_SORT_FILTER)[number];
