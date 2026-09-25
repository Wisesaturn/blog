import { queryOptions } from '@tanstack/react-query';

import { postViewCount } from '@/commons/api/postViewCount';

/**
 * 브라우저에서 읽는 글 데이터의 queryOptions 모음이다.
 *
 * 목록과 상세는 loader 가 서버에서 읽는다. 여기에 두면 Firestore SDK 가 클라이언트 번들에 들어가고,
 * CDN 캐시와 prerender 로 만든 응답을 거치지 않게 된다. 그래서 브라우저가 직접 부르는 조회수만 둔다.
 */
export const postQueries = {
  ALL: ['post'] as const,

  /**
   * 글을 열 때 조회수를 올리고 최신 값을 받는다. 올리는 요청이라 다시 부르지 않도록
   * `staleTime` 을 무한으로 두고 재시도하지 않는다.
   */
  views: (category: string, title: string) =>
    queryOptions({
      queryKey: [...postQueries.ALL, 'views', category, title] as const,
      queryFn: ({ signal }) =>
        postViewCount(
          `/api/post-view/${encodeURIComponent(category)}/${encodeURIComponent(title)}`,
          signal,
        ),
      staleTime: Infinity,
      retry: false,
    }),
};
