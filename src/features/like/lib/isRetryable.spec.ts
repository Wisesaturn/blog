import * as z from 'zod/mini';
import { describe, expect, it } from 'vitest';

import { ApiError } from '@/commons/api/requestJson';

import isRetryable from './isRetryable';

/**
 * `isRetryable` 은 좋아요 요청이 실패했을 때 다시 보낼지를 가른다.
 *
 * 틀리는 방향이 둘이다. 다시 보내도 같은 실패를 다시 보내면 1초마다 요청이 끝없이 나가고,
 * 서버가 이미 올린 요청(응답 모양만 틀림)을 다시 보내면 좋아요가 두 번 오른다. 둘 다 화면에는 드러나지 않는다.
 */

const apiError = (status: number) =>
  new ApiError({ status, url: '/api/stats/post/a/like', body: null });

describe('isRetryable 은 잠깐의 실패만 다시 보낸다', () => {
  it.each([
    ['네트워크 오류', new TypeError('Failed to fetch'), true],
    ['500', apiError(500), true],
    ['503', apiError(503), true],
    ['429', apiError(429), true],
    ['404 (통계 문서 없음)', apiError(404), false],
    ['400 (count 범위 밖)', apiError(400), false],
  ])('%s → %s', (_, error, expected) => {
    expect(isRetryable(error)).toBe(expected);
  });

  it('응답 모양이 틀린 것은 서버가 이미 올린 뒤라 다시 보내지 않는다', () => {
    const result = z.object({ likes: z.number() }).safeParse({});
    expect(result.success).toBe(false);
    expect(isRetryable(result.error)).toBe(false);
  });
});
