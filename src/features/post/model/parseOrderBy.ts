// 목록 페이지 컴포넌트에서도 부르므로 클라이언트 번들에 들어간다. 그래서 가벼운 zod/mini 를 쓴다
import * as z from 'zod/mini';

import { POST_SORT_ORDER_BY } from '../constant';
import { type PostsOrderBy } from '../types/post';

const postsOrderBy = z.catch(z.enum(POST_SORT_ORDER_BY), 'desc');

/**
 * @description 쿼리스트링의 `orderby` 를 정렬 기준으로 읽는다
 * @param value `searchParams.get('orderby')` 의 값
 * @returns 정렬 기준. 없거나 모르는 값이면 최신순(`desc`)
 * @example
 * parseOrderBy('mostView'); // 'mostView'
 * parseOrderBy('foo'); // 'desc'
 */
export default function parseOrderBy(value: string | null): PostsOrderBy {
  return postsOrderBy.parse(value);
}
