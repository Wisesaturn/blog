import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';

import { postLike, statsQueries, type StatKind } from '@/entities/stats';

import createLikeBatcher, { type LikeBatcher } from '../lib/createLikeBatcher';
import isRetryable from '../lib/isRetryable';

interface Like {
  /** 보여 줄 좋아요 수. 받는 중이면 `undefined`, 받지 못하면 `null` */
  likes: number | null | undefined;
  /** 한 번 누른다. 숫자는 바로 오르고 요청은 모아서 나간다 */
  like: () => void;
}

/**
 * @description 콘텐츠 하나의 좋아요 수와 누르는 동작 (#120)
 *
 * 켜고 끄는 스위치가 아니라 누를 때마다 1씩 오르는 카운터다. 사람을 식별하지 않아 누르는 횟수에 제한이 없고,
 * 브라우저에 아무것도 남기지 않는다.
 *
 * 화면 숫자 = 서버 합계(`statsQueries.detail` 캐시) + 아직 서버에 들어가지 않은 클릭 수. 누르면 바로 오르고
 * (낙관적 업데이트), 요청은 1초마다 모아서 보낸다. 응답이 오면 캐시를 서버 합계로 고쳐 다른 사람이 누른 수까지
 * 반영한다. 잠깐의 실패는 숫자를 되돌리지 않고 다음 묶음에 합쳐 다시 보낸다. 다시 보내도 같은 실패(없는
 * 콘텐츠의 404 등)면 보내기를 멈춘다(`isRetryable`).
 *
 * 한 화면에 버튼이 둘(제목 옆, 본문 아래)이어도 이 훅은 페이지에서 한 번만 부르고 둘에 같은 값을 넘긴다.
 * 버튼마다 부르면 모으는 수가 따로 놀아 한쪽 응답이 다른 쪽의 아직 안 보낸 수를 덮는다.
 * @param kind 콘텐츠 종류
 * @param key 콘텐츠 키
 * @returns 보여 줄 좋아요 수와 누르는 함수
 * @example
 * const { likes, like } = useLike('post', `${category}/${title}`);
 */
export default function useLike(kind: StatKind, key: string): Like {
  const queryClient = useQueryClient();
  const detail = useQuery(statsQueries.detail(kind, key));
  const [unsent, setUnsent] = useState(0);
  const batcherRef = useRef<LikeBatcher | null>(null);

  useEffect(() => {
    const { queryKey } = statsQueries.detail(kind, key);
    const batcher = createLikeBatcher({
      send: (count, keepalive) => postLike(kind, key, count, keepalive),
      onSent: (likes) => queryClient.setQueryData(queryKey, (prev) => prev && { ...prev, likes }),
      onChange: setUnsent,
      shouldRetry: isRetryable,
    });
    batcherRef.current = batcher;

    // 탭을 닫거나 다른 앱으로 가면 남은 클릭을 기다리지 않고 보낸다
    const flush = () => batcher.flushNow(true);
    const onVisibility = () => document.visibilityState === 'hidden' && flush();
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', onVisibility);
      // 다른 글로 옮기면 남은 클릭을 보내고 멈춘다
      batcher.flushNow(false);
      batcher.dispose();
      batcherRef.current = null;
      setUnsent(0);
    };
  }, [kind, key, queryClient]);

  const like = useCallback(() => batcherRef.current?.add(), []);

  const base = detail.data?.likes;
  if (base !== undefined) return { likes: base + unsent, like };
  return { likes: detail.isError ? null : undefined, like };
}
