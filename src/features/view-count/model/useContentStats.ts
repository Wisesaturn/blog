import { useQuery } from '@tanstack/react-query';

import { statsQueries, type StatTarget } from '@/entities/stats';

/** `undefined` 는 받는 중, `null` 은 받지 못함. 화면은 각각 skeleton 과 `–` 를 둔다 */
export type StatState = number | null | undefined;

interface ContentStats {
  views: StatState;
  likes: StatState;
}

/**
 * @description 상세 화면의 조회수와 좋아요 수. 열 때 조회수를 한 번 올리고, 통계를 함께 받는다
 *
 * 상세 페이지는 숫자 없이 prerender 한다. 화면을 그린 뒤 두 요청을 동시에 보낸다.
 * - `GET  /api/stats/:kind/:key`: `{ views, likes }`
 * - `POST /api/stats/:kind/:key/view`: 조회수를 올리고 올린 뒤의 값
 *
 * 조회수는 받은 값 중 큰 것을 쓴다. 올린 뒤의 값이 읽은 값보다 작을 수 없으므로 나중에 온 값과 같다.
 * 한쪽만 실패하면 다른 쪽 값을 쓰고, 둘 다 실패해야 `null` 이다.
 * @param target.kind 콘텐츠 종류
 * @param target.key 콘텐츠 키. 글은 `카테고리/제목`, 스니펫과 프로젝트는 제목
 * @returns 지금 보여 줄 조회수와 좋아요 수
 * @example
 * const { views, likes } = useContentStats({ kind: 'post', key: `${category}/${title}` });
 */
export default function useContentStats({ kind, key }: StatTarget): ContentStats {
  const detail = useQuery(statsQueries.detail({ kind, key }));
  const view = useQuery(statsQueries.view({ kind, key }));

  const received = [detail.data?.views, view.data].filter((v): v is number => v !== undefined);
  const views = received.length ? Math.max(...received) : undefined;

  return {
    views: views ?? (detail.isError && view.isError ? null : undefined),
    likes: detail.data?.likes ?? (detail.isError ? null : undefined),
  };
}
