import { POST_SORT_FILTER, POST_SORT_ORDER_BY } from '../constant';
import { Tag } from './article';

export interface IPost {
  body: string;
  category: string;
  createdAt: string;
  description: string;
  index: string;
  lastmod: string;
  last_editedAt: Date | string;
  plain_title: string;
  tags: Tag[];
  thumbnail: string;
  title: string;
  views: number;
}

export type PostsOrderBy = (typeof POST_SORT_ORDER_BY)[number];
export type PostsFilter = (typeof POST_SORT_FILTER)[number];

// IPost Type Guard
export function isIPost(obj: unknown): obj is IPost {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'body' in obj &&
    'category' in obj &&
    'createdAt' in obj &&
    'description' in obj &&
    'index' in obj &&
    'lastmod' in obj &&
    'last_editedAt' in obj &&
    'plain_title' in obj &&
    'tags' in obj &&
    'thumbnail' in obj &&
    'title' in obj &&
    'views' in obj
  );
}
