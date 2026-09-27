import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import * as zm from 'zod/mini';

import { ApiError, requestJson } from './requestJson';

/**
 * `requestJson` 은 브라우저가 우리 API 라우트를 부르는 공용 통로다. 통계, 좋아요, 댓글이 모두 거친다.
 *
 * 여기서 실패를 삼키거나 상태 코드를 잃으면, 화면은 멀쩡한데 숫자가 비거나 "잠시 뒤에 다시" 같은 안내가
 * 나오지 않는다. 틀린 모양의 응답을 그대로 넘겨도 에러 없이 이상한 값이 그려진다.
 */

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const mockFetch = (response: Response) => {
  const fn = vi.fn<typeof fetch>().mockResolvedValue(response);
  vi.stubGlobal('fetch', fn);
  return fn;
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('requestJson 은 응답을 스키마로 검사해 돌려준다', () => {
  const stat = zm.object({ views: zm.number(), likes: zm.number() });

  it('스키마를 통과한 값을 돌려준다', async () => {
    mockFetch(jsonResponse({ views: 3, likes: 1 }));
    await expect(requestJson({ url: '/api/stats/post/a/b', schema: stat })).resolves.toEqual({
      views: 3,
      likes: 1,
    });
  });

  it('zod(전체) 스키마도 받는다', async () => {
    mockFetch(jsonResponse({ views: 3 }));
    await expect(
      requestJson({ url: '/x', schema: z.object({ views: z.number() }) }),
    ).resolves.toEqual({ views: 3 });
  });

  it('스키마에 없는 필드는 빼고 돌려준다', async () => {
    mockFetch(jsonResponse({ views: 3, likes: 1, secret: 'x' }));
    await expect(requestJson({ url: '/x', schema: stat })).resolves.toEqual({ views: 3, likes: 1 });
  });

  it('모양이 틀리면 ApiError 가 아니라 zod 검사 에러를 던진다', async () => {
    mockFetch(jsonResponse({ views: '3' }));
    const error = await requestJson({ url: '/x', schema: stat }).catch((e: unknown) => e);
    expect(error).not.toBeInstanceOf(ApiError);
    expect(error).toBeInstanceOf(zm.core.$ZodError);
  });
});

describe('requestJson 은 실패 상태 코드를 ApiError 로 던진다', () => {
  it.each([400, 403, 404, 429, 500])('%i 이면 status 와 본문을 담는다', async (status) => {
    mockFetch(jsonResponse({ message: '실패' }, status));
    await expect(requestJson({ url: '/api/x', schema: zm.object({}) })).rejects.toMatchObject({
      name: 'ApiError',
      status,
      url: '/api/x',
      body: { message: '실패' },
    });
  });

  it('실패 본문이 JSON 이 아니면 body 는 null 이다', async () => {
    mockFetch(new Response('Bad Gateway', { status: 502 }));
    await expect(requestJson({ url: '/x', schema: zm.object({}) })).rejects.toMatchObject({
      status: 502,
      body: null,
    });
  });
});

describe('requestJson 은 fetch 옵션을 넘기고 json 을 본문으로 보낸다', () => {
  it('json 을 직렬화하고 Content-Type 을 붙인다', async () => {
    const fetchFn = mockFetch(jsonResponse({ likes: 4 }));
    await requestJson({
      url: '/like',
      schema: zm.object({ likes: zm.number() }),
      method: 'POST',
      json: { count: 3 },
    });

    const [, init] = fetchFn.mock.calls[0];
    expect(init?.method).toBe('POST');
    expect(init?.body).toBe('{"count":3}');
    expect(new Headers(init?.headers).get('Content-Type')).toBe('application/json');
  });

  it('json 이 없으면 본문과 Content-Type 을 붙이지 않는다', async () => {
    const fetchFn = mockFetch(jsonResponse({}));
    await requestJson({ url: '/x', schema: zm.object({}) });

    const [, init] = fetchFn.mock.calls[0];
    expect(init?.body).toBeUndefined();
    expect(new Headers(init?.headers).has('Content-Type')).toBe(false);
  });

  it('signal 과 keepalive, 헤더를 그대로 넘긴다', async () => {
    const fetchFn = mockFetch(jsonResponse({}));
    const controller = new AbortController();
    await requestJson({
      url: '/x',
      schema: zm.object({}),
      signal: controller.signal,
      keepalive: true,
      headers: { Authorization: 'Bearer t' },
    });

    const [, init] = fetchFn.mock.calls[0];
    expect(init?.signal).toBe(controller.signal);
    expect(init?.keepalive).toBe(true);
    expect(new Headers(init?.headers).get('Authorization')).toBe('Bearer t');
  });
});
