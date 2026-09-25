import { queryOptions } from '@tanstack/react-query';

import { postViewCount } from '@/commons/api/postViewCount';

/**
 * 브라우저에서 읽는 스니펫 데이터의 queryOptions 모음이다.
 *
 * 목록과 상세는 loader 가 서버에서 읽는다. 브라우저가 직접 부르는 조회수만 둔다.
 * 이유는 `postQueries` 와 같다.
 */
export const snippetQueries = {
  ALL: ['snippet'] as const,

  /** 열 때 조회수를 올리고 최신 값을 받는다. 다시 부르지 않도록 `staleTime` 을 무한으로 둔다 */
  views: (title: string) =>
    queryOptions({
      queryKey: [...snippetQueries.ALL, 'views', title] as const,
      queryFn: ({ signal }) =>
        postViewCount(`/api/snippet-view/${encodeURIComponent(title)}`, signal),
      staleTime: Infinity,
      retry: false,
    }),
};
