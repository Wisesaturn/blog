import { queryOptions } from '@tanstack/react-query';

import { type StatKind, type StatTarget } from '../model/stat';
import { fetchStat, fetchStats, postView } from './apis.client';

/**
 * 브라우저에서 읽는 통계의 queryOptions 모음이다.
 *
 * 목록과 상세 페이지는 숫자 없이 prerender 하고, 숫자는 여기로 받아 끼운다. 서버 prefetch 를 하면
 * 빌드 시점의 값이 HTML 에 굳으므로 쓰지 않는다.
 */
export const statsQueries = {
  ALL: ['stats'] as const,

  /** 한 종류의 통계 전부. API 가 CDN 에 60초 캐시되므로 브라우저도 그만큼 다시 부르지 않는다 */
  list: (kind: StatKind) =>
    queryOptions({
      queryKey: [...statsQueries.ALL, kind, 'list'] as const,
      queryFn: ({ signal }) => fetchStats({ kind, signal }),
      staleTime: 60_000,
    }),

  /** 콘텐츠 하나의 `{ views, likes }`. 좋아요를 누르면 이 캐시를 고친다 */
  detail: ({ kind, key }: StatTarget) =>
    queryOptions({
      queryKey: [...statsQueries.ALL, kind, 'detail', key] as const,
      queryFn: ({ signal }) => fetchStat({ kind, key, signal }),
    }),

  /**
   * 상세를 열 때 조회수를 올리고 올린 뒤의 값을 받는다. 올리는 요청이라 다시 부르지 않도록
   * `staleTime` 을 무한으로 두고 재시도하지 않는다.
   */
  view: ({ kind, key }: StatTarget) =>
    queryOptions({
      queryKey: [...statsQueries.ALL, kind, 'view', key] as const,
      queryFn: ({ signal }) => postView({ kind, key, signal }),
      staleTime: Infinity,
      retry: false,
    }),
};
