import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { statsQueries, type StatKind } from '@/entities/stats';

import { type StatState } from './useContentStats';

interface ListStats {
  /** 통계를 받았는지. 받기 전에는 조회순 정렬을 할 수 없다 */
  isReady: boolean;
  /** 화면에 보일 조회수. 받는 중이면 `undefined`, 받지 못하면 `null`, 통계가 없는 콘텐츠는 0 */
  views: (key: string) => StatState;
  /** 정렬에 쓸 조회수. 통계를 받은 뒤에만 있다 */
  viewsOf: ((key: string) => number) | undefined;
}

/**
 * @description 목록 화면의 조회수. 한 종류의 통계를 한 번 받아 카드마다 끼운다
 *
 * 목록 페이지는 숫자 없이 prerender 한다 (#119). 화면을 그린 뒤 `GET /api/stats/:kind` 를 한 번 부른다.
 * 응답은 CDN 에 60초 캐시되므로 목록의 숫자는 최대 1분 늦을 수 있다.
 * @param kind 콘텐츠 종류
 * @returns 콘텐츠 키로 조회수를 찾는 함수들
 * @example
 * const stats = useListStats('post');
 * <PostRow views={stats.views(postStatKey(post))} />
 */
export default function useListStats(kind: StatKind): ListStats {
  const { data, isError } = useQuery(statsQueries.list(kind));

  return useMemo(() => {
    if (data) {
      const viewsOf = (key: string) => data[key]?.views ?? 0;
      return { isReady: true, views: viewsOf, viewsOf };
    }
    return { isReady: false, views: () => (isError ? null : undefined), viewsOf: undefined };
  }, [data, isError]);
}
