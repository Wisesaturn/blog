/**
 * `useLike` 는 좋아요 연타를 1초마다 모아 `useMutation` 으로 보낸다.
 *
 * 여기서 틀리면 에러 없이 좋아요가 빠지거나 숫자가 어긋난다. 화면에는 드러나지 않고 새로고침해야 보인다.
 * - 보내는 중에 눌린 수를 잃거나, 떠날 때 남은 수를 보내지 않으면 새로고침 뒤 숫자가 줄어 있다
 * - 묶지 못하면 연타가 곧 Firestore 쓰기 폭증이다
 * - 다시 보내도 같은 실패(404)를 계속 보내면 페이지를 떠날 때까지 요청이 나간다
 * - 같은 상세 라우트에서 다른 글로 옮기면 페이지가 다시 마운트되지 않는다. 옛 글의 응답이 새 글의 숫자를
 *   고치면 엉뚱한 숫자가 된다
 * - 응답 순서가 바뀌어 늦게 온 옛 합계로 덮으면 숫자가 줄어든다
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { postLike, statsQueries, type StatTarget } from '@/entities/stats';

import { ApiError } from '@/commons/api/requestJson';

import useLike, { SEND_INTERVAL } from './useLike';

vi.mock('@/entities/stats', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/entities/stats')>()),
  postLike: vi.fn(),
}));

const mockedPostLike = vi.mocked(postLike);

const A: StatTarget = { kind: 'post', key: 'react/글-A' };
const B: StatTarget = { kind: 'post', key: 'react/글-B' };

/** 응답을 테스트가 정한 때에 돌려주는 요청 */
function deferred() {
  let resolve: (likes: number) => void = () => {};
  let reject: (error: unknown) => void = () => {};
  const promise = new Promise<number>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

let queryClient: QueryClient;

function setup(target: StatTarget = A, likes: number | null = 5) {
  if (likes !== null) {
    queryClient.setQueryData(statsQueries.detail(target).queryKey, { views: 0, likes });
  }
  const wrapper = ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
  return renderHook((props: StatTarget) => useLike(props), { wrapper, initialProps: target });
}

/** 타이머를 감고, 뒤따르는 mutation 콜백과 state 갱신까지 흘려보낸다 */
async function advance(ms: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
}

const sentCounts = () => mockedPostLike.mock.calls.map(([params]) => params.count);

beforeEach(() => {
  vi.useFakeTimers();
  queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: Infinity, retry: false } },
  });
  // 캐시를 채우지 않은 상세 조회는 실패하게 둔다
  vi.stubGlobal(
    'fetch',
    vi.fn(() => Promise.reject(new TypeError('Failed to fetch'))),
  );
});

afterEach(() => {
  queryClient.clear();
  mockedPostLike.mockReset();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('useLike 는 누른 수를 모아 1초마다 한 번에 보낸다', () => {
  it('10번 누르면 숫자는 바로 10 오르고, 요청은 1초 뒤에 한 번, 10 을 보낸다', async () => {
    mockedPostLike.mockResolvedValue(15);
    const { result } = setup();

    act(() => {
      for (let i = 0; i < 10; i += 1) result.current.like();
    });
    expect(result.current.likes).toBe(15);
    expect(mockedPostLike).not.toHaveBeenCalled();

    await advance(SEND_INTERVAL);
    expect(sentCounts()).toEqual([10]);
    expect(mockedPostLike).toHaveBeenCalledWith({ ...A, count: 10, keepalive: false });
    expect(result.current.likes).toBe(15);
  });

  it('보내는 중에 눌린 수는 응답이 온 뒤에 다음 묶음으로 보낸다', async () => {
    const first = deferred();
    mockedPostLike.mockReturnValueOnce(first.promise).mockResolvedValue(9);
    const { result } = setup();

    act(() => result.current.like());
    await advance(SEND_INTERVAL);
    act(() => {
      result.current.like();
      result.current.like();
    });
    await advance(SEND_INTERVAL * 3);
    expect(sentCounts()).toEqual([1]);
    expect(result.current.likes).toBe(8);

    await act(async () => first.resolve(6));
    await advance(SEND_INTERVAL);
    expect(sentCounts()).toEqual([1, 2]);
    expect(result.current.likes).toBe(9);
  });

  it('한 번에 100 을 넘기지 않고, 넘는 만큼은 다음 묶음으로 보낸다', async () => {
    mockedPostLike.mockResolvedValueOnce(105).mockResolvedValue(135);
    const { result } = setup();

    act(() => {
      for (let i = 0; i < 130; i += 1) result.current.like();
    });
    await advance(SEND_INTERVAL);
    await advance(SEND_INTERVAL);
    expect(sentCounts()).toEqual([100, 30]);
    expect(result.current.likes).toBe(135);
  });
});

describe('useLike 는 실패 종류에 따라 다시 보낼지 정한다', () => {
  it('5xx 는 숫자를 되돌리지 않고 간격을 늘려 다시 보낸다', async () => {
    const serverError = new ApiError({ status: 500, url: '/like', body: null });
    mockedPostLike
      .mockRejectedValueOnce(serverError)
      .mockRejectedValueOnce(serverError)
      .mockResolvedValue(6);
    const { result } = setup();

    act(() => result.current.like());
    await advance(SEND_INTERVAL);
    expect(mockedPostLike).toHaveBeenCalledTimes(1);
    expect(result.current.likes).toBe(6);

    // TanStack Query 의 기본 간격: 첫 재시도 1초, 다음 2초
    await advance(1000);
    expect(mockedPostLike).toHaveBeenCalledTimes(2);
    await advance(1999);
    expect(mockedPostLike).toHaveBeenCalledTimes(2);
    await advance(1);
    expect(mockedPostLike).toHaveBeenCalledTimes(3);
    expect(result.current.likes).toBe(6);
  });

  it('404 는 한 번만 보내고 멈춘다. 그 수는 버리고 뒤에 누른 것도 보내지 않는다', async () => {
    mockedPostLike.mockRejectedValue(new ApiError({ status: 404, url: '/like', body: null }));
    const { result } = setup();

    act(() => result.current.like());
    await advance(SEND_INTERVAL);
    await advance(10_000);
    expect(mockedPostLike).toHaveBeenCalledTimes(1);
    expect(result.current.likes).toBe(5);

    act(() => result.current.like());
    await advance(10_000);
    expect(mockedPostLike).toHaveBeenCalledTimes(1);
    expect(result.current.likes).toBe(5);
  });
});

describe('useLike 는 떠날 때 남은 수를 keepalive 로 바로 보낸다', () => {
  it('pagehide 면 1초를 기다리지 않고 keepalive 로 보낸다', async () => {
    mockedPostLike.mockResolvedValue(7);
    const { result } = setup();

    act(() => {
      result.current.like();
      result.current.like();
    });
    await act(async () => {
      window.dispatchEvent(new Event('pagehide'));
    });
    expect(mockedPostLike).toHaveBeenCalledWith({ ...A, count: 2, keepalive: true });
  });

  it('다른 글로 옮기면 남은 수를 옛 글로 보낸다', async () => {
    mockedPostLike.mockResolvedValue(8);
    const { result, rerender } = setup();

    act(() => {
      for (let i = 0; i < 3; i += 1) result.current.like();
    });
    queryClient.setQueryData(statsQueries.detail(B).queryKey, { views: 0, likes: 0 });
    rerender(B);
    await advance(0);
    expect(mockedPostLike).toHaveBeenCalledWith({ ...A, count: 3, keepalive: false });
  });
});

describe('useLike 는 늦게 온 응답이나 다른 글의 응답으로 숫자를 어긋나게 하지 않는다', () => {
  it('응답 순서가 바뀌어도 큰 합계를 남긴다', async () => {
    const older = deferred();
    const newer = deferred();
    mockedPostLike.mockReturnValueOnce(older.promise).mockReturnValueOnce(newer.promise);
    const { result } = setup();

    act(() => {
      for (let i = 0; i < 5; i += 1) result.current.like();
    });
    await advance(SEND_INTERVAL);
    act(() => {
      for (let i = 0; i < 3; i += 1) result.current.like();
    });
    // 탭을 바꾸면 보내는 중인 요청을 기다리지 않고 따로 보낸다
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');
    await act(async () => {
      document.dispatchEvent(new Event('visibilitychange'));
    });
    expect(sentCounts()).toEqual([5, 3]);

    // 서버는 +5, +3 순서로 처리했고 응답은 +3 쪽이 먼저 온다
    await act(async () => newer.resolve(13));
    await act(async () => older.resolve(10));
    await advance(0);
    expect(result.current.likes).toBe(13);
    expect(queryClient.getQueryData(statsQueries.detail(A).queryKey)?.likes).toBe(13);
  });

  it('다른 글로 옮긴 뒤에 온 옛 글의 응답은 새 글의 숫자를 고치지 않는다', async () => {
    const oldPost = deferred();
    mockedPostLike.mockReturnValueOnce(oldPost.promise).mockResolvedValue(2);
    const { result, rerender } = setup();

    act(() => {
      for (let i = 0; i < 5; i += 1) result.current.like();
    });
    await advance(SEND_INTERVAL);

    queryClient.setQueryData(statsQueries.detail(B).queryKey, { views: 0, likes: 0 });
    rerender(B);
    act(() => {
      result.current.like();
      result.current.like();
    });
    expect(result.current.likes).toBe(2);

    await act(async () => oldPost.resolve(10));
    await advance(0);
    expect(result.current.likes).toBe(2);
    // 옛 글의 캐시는 옛 글의 합계로 고친다
    expect(queryClient.getQueryData(statsQueries.detail(A).queryKey)?.likes).toBe(10);
  });

  it('상세 조회가 실패해도 좋아요 응답을 받으면 그 합계를 보여 준다', async () => {
    mockedPostLike.mockResolvedValue(7);
    const { result } = setup(A, null);

    await advance(0);
    expect(result.current.likes).toBeNull();

    act(() => result.current.like());
    await advance(SEND_INTERVAL);
    expect(result.current.likes).toBe(7);
  });
});
