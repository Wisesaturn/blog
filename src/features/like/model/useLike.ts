import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';

import { MAX_LIKE_COUNT, postLike, statsQueries, type StatTarget } from '@/entities/stats';

import isRetryable from '../lib/isRetryable';

/** 첫 클릭부터 이 시간 동안 모인 수를 한 번에 보낸다. 계속 누르면 이 간격마다 보낸다 */
export const SEND_INTERVAL = 1000;

interface Like {
  /** 보여 줄 좋아요 수. 받는 중이면 `undefined`, 받지 못하면 `null` */
  likes: number | null | undefined;
  /** 한 번 누른다. 숫자는 바로 오르고 요청은 모아서 나간다 */
  like: () => void;
}

/**
 * 콘텐츠 하나를 보는 동안의 전송 상태. 키가 바뀌면 새로 만든다.
 *
 * 요청의 variables 에 실어 보내서, 응답이 왔을 때 어느 콘텐츠의 것인지 가린다. 같은 상세 라우트에서 다른 글로
 * 옮기면 페이지가 다시 마운트되지 않는다. 옛 글의 응답이 새 글의 숫자를 고치지 않게 하려면 이 구분이 필요하다.
 */
interface LikeSession extends StatTarget {
  /** 모았지만 아직 보내지 않은 수 */
  pending: number;
  /** 보냈지만 아직 응답이 오지 않은 수. 다시 보내는 중인 것도 여기 있다 */
  inFlight: number;
  /** 다시 보내도 같은 실패(없는 콘텐츠의 404 등)를 받았다. 더 보내지 않는다 */
  stopped: boolean;
  timer?: ReturnType<typeof setTimeout>;
}

interface LikeVariables {
  session: LikeSession;
  count: number;
  keepalive: boolean;
}

const stopTimer = (session: LikeSession) => {
  clearTimeout(session.timer);
  session.timer = undefined;
};

/**
 * @description 콘텐츠 하나의 좋아요 수와 누르는 동작 (#120)
 *
 * 켜고 끄는 스위치가 아니라 누를 때마다 1씩 오르는 카운터다. 사람을 식별하지 않아 누르는 횟수에 제한이 없고,
 * 브라우저에 아무것도 남기지 않는다.
 *
 * 화면 숫자 = 서버 합계 + 아직 서버 합계에 들어가지 않은 클릭 수. 누르면 바로 오른다(낙관적 업데이트).
 * - 요청은 첫 클릭부터 1초 뒤에 그동안 모인 수를 `useMutation` 으로 보낸다. 한 번에 하나만 보내고,
 *   보내는 동안 눌린 수는 응답이 온 뒤에 보낸다. 한 번에 100 을 넘기지 않는다
 * - 응답이 오면 `statsQueries.detail` 캐시를 서버 합계로 고친다. 좋아요는 줄지 않는 값이라 큰 쪽을 남긴다.
 *   떠날 때 보낸 요청과 겹쳐 응답 순서가 바뀌어도 숫자가 되돌아가지 않는다
 * - 잠깐의 실패는 되돌리지 않고 TanStack Query 의 `retry` 로 다시 보낸다. 간격은 기본값 그대로
 *   1초, 2초, 4초 … 최대 30초다. 다시 보내도 같은 실패면 그 수를 버리고 멈춘다(`isRetryable`)
 * - 탭을 닫거나 다른 앱으로 가면 기다리지 않고 남은 수를 keepalive 로 보낸다. 다른 글로 옮길 때도 보낸다
 *
 * 한 화면에 버튼이 둘(제목 옆, 본문 아래)이어도 이 훅은 페이지에서 한 번만 부르고 둘에 같은 값을 넘긴다.
 * 버튼마다 부르면 모으는 수가 따로 논다.
 * @param target.kind 콘텐츠 종류
 * @param target.key 콘텐츠 키
 * @returns 보여 줄 좋아요 수와 누르는 함수
 * @example
 * const { likes, like } = useLike({ kind: 'post', key: `${category}/${title}` });
 */
export default function useLike({ kind, key }: StatTarget): Like {
  const queryClient = useQueryClient();
  const detail = useQuery(statsQueries.detail({ kind, key }));
  const [unsent, setUnsent] = useState(0);
  // 상세 조회가 실패했거나 아직 오지 않았으면 캐시가 비어 있어 응답을 쓸 곳이 없다. 그때 쓸 서버 합계다
  const [sentLikes, setSentLikes] = useState<number>();
  const sessionRef = useRef<LikeSession | null>(null);

  // onSettled 에서 다음 묶음을 보내려면 send 가 필요하고, send 는 mutate 가 필요하다. ref 로 순환을 끊는다
  const sendRef = useRef<(session: LikeSession, keepalive: boolean) => void>(() => {});

  const sync = useCallback((session: LikeSession) => {
    if (sessionRef.current === session) setUnsent(session.pending + session.inFlight);
  }, []);

  const schedule = useCallback((session: LikeSession) => {
    if (session.timer !== undefined || session.stopped) return;
    session.timer = setTimeout(() => {
      session.timer = undefined;
      // 한 번에 하나만 보낸다. 보내는 중이면 응답이 온 뒤(onSettled)에 다시 잡는다
      if (session.inFlight === 0) sendRef.current(session, false);
    }, SEND_INTERVAL);
  }, []);

  const { mutate } = useMutation({
    mutationFn: ({ session, count, keepalive }: LikeVariables) =>
      postLike({ kind: session.kind, key: session.key, count, keepalive }),
    retry: (_failureCount, error) => isRetryable(error),
    onSuccess: (likes, { session }) => {
      queryClient.setQueryData(
        statsQueries.detail(session).queryKey,
        (prev) => prev && { ...prev, likes: Math.max(prev.likes, likes) },
      );
      if (sessionRef.current === session) setSentLikes((prev) => Math.max(prev ?? 0, likes));
    },
    onError: (_error, { session }) => {
      // retry 가 다시 보내지 않기로 한 실패만 여기 온다. 다시 보내도 같으니 남은 것까지 버리고 멈춘다
      session.stopped = true;
      session.pending = 0;
      stopTimer(session);
    },
    onSettled: (_data, _error, { session, count }) => {
      session.inFlight -= count;
      sync(session);
      if (session.pending > 0 && sessionRef.current === session) schedule(session);
    },
  });

  sendRef.current = (session, keepalive) => {
    const count = Math.min(session.pending, MAX_LIKE_COUNT);
    if (count === 0 || session.stopped) return;
    session.pending -= count;
    session.inFlight += count;
    sync(session);
    mutate({ session, count, keepalive });
  };

  useEffect(() => {
    const session: LikeSession = { kind, key, pending: 0, inFlight: 0, stopped: false };
    sessionRef.current = session;
    setUnsent(0);
    setSentLikes(undefined);

    // 떠나는 중에는 보내는 중인 요청을 기다릴 수 없어 남은 것을 따로 보낸다
    const flush = (keepalive: boolean) => {
      stopTimer(session);
      while (session.pending > 0 && !session.stopped) sendRef.current(session, keepalive);
    };
    const onPageHide = () => flush(true);
    const onVisibility = () => document.visibilityState === 'hidden' && flush(true);
    window.addEventListener('pagehide', onPageHide);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.removeEventListener('pagehide', onPageHide);
      document.removeEventListener('visibilitychange', onVisibility);
      // 다른 글로 옮기면 남은 클릭을 보내고, 이 세션의 응답이 더는 화면을 고치지 않게 떼어 낸다
      flush(false);
      sessionRef.current = null;
    };
  }, [kind, key]);

  const like = useCallback(() => {
    const session = sessionRef.current;
    if (!session || session.stopped) return;
    session.pending += 1;
    sync(session);
    schedule(session);
  }, [schedule, sync]);

  const known = [detail.data?.likes, sentLikes].filter((v): v is number => v !== undefined);
  if (known.length > 0) return { likes: Math.max(...known) + unsent, like };
  return { likes: detail.isError ? null : undefined, like };
}
