import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import createLikeBatcher from './createLikeBatcher';

/**
 * `createLikeBatcher` 는 좋아요 연타를 모아 1초마다 보낸다.
 *
 * 여기서 틀리면 에러 없이 좋아요가 빠진다. 보내는 중에 눌린 수를 잃거나, 실패한 묶음을 버리거나,
 * 탭을 닫을 때 남은 수를 보내지 않으면 화면에는 올라갔던 숫자가 새로고침 뒤 줄어 있다.
 * 반대로 묶지 못하면 연타가 곧 Firestore 쓰기 폭증이다.
 *
 * 다시 보내도 같은 실패(없는 콘텐츠의 404)를 계속 다시 보내면 페이지를 떠날 때까지 1초마다 요청이 나간다.
 * 화면에는 아무 표시가 없어서 네트워크 탭을 봐야만 드러난다.
 */

const setup = (send = vi.fn((count: number) => Promise.resolve(count))) => {
  const onSent = vi.fn();
  const onChange = vi.fn();
  const batcher = createLikeBatcher({ send, onSent, onChange, interval: 1000, max: 100 });
  return { batcher, send, onSent, onChange };
};

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('createLikeBatcher 는 누른 수를 모아 간격마다 한 번에 보낸다', () => {
  it('1초 안에 10번 누르면 요청은 한 번, 10 을 보낸다', async () => {
    const { batcher, send } = setup();
    for (let i = 0; i < 10; i += 1) batcher.add();

    expect(send).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1000);
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith(10, false);
  });

  it('계속 누르면 간격마다 그동안 모인 수를 보내고, 마지막 묶음도 보낸다', async () => {
    const { batcher, send } = setup();
    for (let i = 0; i < 3; i += 1) batcher.add();
    await vi.advanceTimersByTimeAsync(1000);
    for (let i = 0; i < 2; i += 1) batcher.add();
    await vi.advanceTimersByTimeAsync(1000);

    expect(send.mock.calls.map(([count]) => count)).toEqual([3, 2]);
  });

  it('보내는 중에 눌린 수는 다음 묶음으로 넘어간다', async () => {
    let resolve: (likes: number) => void = () => {};
    const send = vi.fn((_count: number) => new Promise<number>((r) => (resolve = r)));
    const { batcher, onChange } = setup(send);

    batcher.add();
    await vi.advanceTimersByTimeAsync(1000);
    batcher.add();
    batcher.add();
    expect(batcher.unsent()).toBe(3);

    resolve(1);
    await vi.advanceTimersByTimeAsync(1000);
    expect(send.mock.calls.map(([count]) => count)).toEqual([1, 2]);
    expect(onChange).toHaveBeenLastCalledWith(2);
  });

  it('한 번에 100 을 넘기지 않고, 넘는 만큼은 다음 묶음으로 보낸다', async () => {
    const { batcher, send } = setup();
    for (let i = 0; i < 130; i += 1) batcher.add();
    await vi.advanceTimersByTimeAsync(1000);
    await vi.advanceTimersByTimeAsync(1000);

    expect(send.mock.calls.map(([count]) => count)).toEqual([100, 30]);
  });
});

describe('createLikeBatcher 는 서버 합계와 아직 안 들어간 수를 나눠 알린다', () => {
  it('성공하면 서버 합계를 onSent 로 주고 unsent 는 0 이 된다', async () => {
    const { batcher, onSent } = setup(vi.fn(() => Promise.resolve(42)));
    batcher.add();
    await vi.advanceTimersByTimeAsync(1000);

    expect(onSent).toHaveBeenCalledWith(42);
    expect(batcher.unsent()).toBe(0);
  });

  it('실패하면 되돌리지 않고 다음 묶음에 합쳐 다시 보낸다', async () => {
    const send = vi
      .fn<(count: number) => Promise<number>>()
      .mockRejectedValueOnce(new Error('500'))
      .mockResolvedValue(5);
    const { batcher, onSent } = setup(send);

    batcher.add();
    batcher.add();
    await vi.advanceTimersByTimeAsync(1000);
    expect(batcher.unsent()).toBe(2);

    batcher.add();
    // 한 번 실패했으므로 다음 간격은 2초다
    await vi.advanceTimersByTimeAsync(2000);
    expect(send.mock.calls.map(([count]) => count)).toEqual([2, 3]);
    expect(onSent).toHaveBeenCalledWith(5);
  });
});

describe('createLikeBatcher 는 떠날 때 남은 수를 keepalive 로 바로 보낸다', () => {
  it('간격을 기다리지 않고 keepalive 로 보낸다', () => {
    const { batcher, send } = setup();
    batcher.add();
    batcher.add();
    batcher.flushNow(true);

    expect(send).toHaveBeenCalledWith(2, true);
  });

  it('보낼 것이 없으면 요청하지 않는다', () => {
    const { batcher, send } = setup();
    batcher.flushNow(true);
    expect(send).not.toHaveBeenCalled();
  });

  it('dispose 뒤에는 모아 둔 수를 간격으로 보내지 않는다', async () => {
    const { batcher, send } = setup();
    batcher.add();
    batcher.dispose();
    await vi.advanceTimersByTimeAsync(2000);
    expect(send).not.toHaveBeenCalled();
  });
});

describe('createLikeBatcher 는 실패 종류에 따라 다시 보낼지 정한다', () => {
  it('다시 보내지 않을 실패면 한 번만 보내고 멈춘다', async () => {
    const send = vi.fn(() => Promise.reject(new Error('404')));
    const onChange = vi.fn();
    const batcher = createLikeBatcher({
      send,
      onSent: vi.fn(),
      onChange,
      shouldRetry: () => false,
    });

    batcher.add();
    await vi.advanceTimersByTimeAsync(10_000);
    expect(send).toHaveBeenCalledTimes(1);
    expect(batcher.unsent()).toBe(0);
    expect(onChange).toHaveBeenLastCalledWith(0);
  });

  it('멈춘 뒤에 누른 것은 모으지도 보내지도 않는다', async () => {
    const send = vi.fn(() => Promise.reject(new Error('404')));
    const batcher = createLikeBatcher({
      send,
      onSent: vi.fn(),
      onChange: vi.fn(),
      shouldRetry: () => false,
    });

    batcher.add();
    await vi.advanceTimersByTimeAsync(1000);
    batcher.add();
    batcher.flushNow(true);
    await vi.advanceTimersByTimeAsync(10_000);
    expect(send).toHaveBeenCalledTimes(1);
    expect(batcher.unsent()).toBe(0);
  });

  it('실패가 이어지면 간격을 1초, 2초, 4초 … 로 늘리고 상한을 넘지 않는다', async () => {
    const send = vi.fn((_count: number) => Promise.reject(new Error('500')));
    const batcher = createLikeBatcher({
      send,
      onSent: vi.fn(),
      onChange: vi.fn(),
      maxInterval: 4000,
    });

    batcher.add();
    const sentAt: number[] = [];
    for (let t = 0; t < 20_000; t += 100) {
      const before = send.mock.calls.length;
      await vi.advanceTimersByTimeAsync(100);
      if (send.mock.calls.length > before) sentAt.push(t + 100);
    }
    expect(sentAt.slice(0, 6)).toEqual([1000, 3000, 7000, 11_000, 15_000, 19_000]);
    expect(batcher.unsent()).toBe(1);
  });

  it('성공하면 간격이 다시 1초로 돌아온다', async () => {
    const send = vi
      .fn<(count: number) => Promise<number>>()
      .mockRejectedValueOnce(new Error('500'))
      .mockRejectedValueOnce(new Error('500'))
      .mockResolvedValue(1);
    const batcher = createLikeBatcher({ send, onSent: vi.fn(), onChange: vi.fn() });

    batcher.add();
    await vi.advanceTimersByTimeAsync(1000 + 2000 + 4000);
    expect(send).toHaveBeenCalledTimes(3);

    batcher.add();
    await vi.advanceTimersByTimeAsync(1000);
    expect(send).toHaveBeenCalledTimes(4);
  });
});
