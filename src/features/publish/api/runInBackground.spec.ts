/**
 * `runInBackground` 는 발행 API 가 202 를 먼저 돌려준 뒤 이어 가는 발행 작업을 감싼다 (#134).
 *
 * 응답이 이미 나갔으므로 발행이 실패해도 Notion 에는 아무것도 보이지 않는다. 로그가 실패를 알 수 있는 유일한 곳이라,
 * 에러를 삼키면서 원인까지 남기는지를 여기서 고정한다. 작업의 reject 가 새면 처리되지 않은 rejection 으로 함수가 죽는다.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import Logger from '@/commons/lib/logger';

import runInBackground from './runInBackground';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('runInBackground 는 응답 뒤의 발행 작업을 끝까지 돌리고 결과를 로그로 남긴다', () => {
  it('작업이 끝나면 성공 로그를 남긴다', async () => {
    const success = vi.spyOn(Logger, 'success').mockImplementation(() => {});

    await runInBackground('page-1 게시물 발행', async () => {});

    expect(success).toHaveBeenCalledWith('page-1 게시물 발행을 마쳤습니다.');
  });

  it('작업이 실패해도 reject 하지 않는다', async () => {
    vi.spyOn(Logger, 'error').mockImplementation(() => {});

    await expect(
      runInBackground('page-1 게시물 발행', async () => {
        throw new Error('실패');
      }),
    ).resolves.toBeUndefined();
  });

  it('실패하면 cause 를 따라가며 원인을 모두 남긴다', async () => {
    const error = vi.spyOn(Logger, 'error').mockImplementation(() => {});
    const cover = new Error('이미지를 받지 못했습니다. 404');
    const create = new Error('page-1 게시물 생성에 실패하였습니다.', { cause: cover });

    await runInBackground('page-1 게시물 발행', async () => {
      throw create;
    });

    const logged = error.mock.calls[0][0];
    expect(logged.message).toBe('page-1 게시물 발행에 실패했습니다.');
    expect(logged.cause).toBe(
      'page-1 게시물 생성에 실패하였습니다. ← 이미지를 받지 못했습니다. 404',
    );
  });

  it('Error 가 아닌 값을 던져도 그 값을 남긴다', async () => {
    const error = vi.spyOn(Logger, 'error').mockImplementation(() => {});

    await runInBackground('page-1 게시물 발행', () => Promise.reject('timeout'));

    expect(error.mock.calls[0][0].cause).toBe('timeout');
  });
});
