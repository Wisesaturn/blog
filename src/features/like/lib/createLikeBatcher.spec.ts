import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import createLikeBatcher from './createLikeBatcher';

/**
 * `createLikeBatcher` 는 좋아요 연타를 모아 1초마다 보낸다.
 *
 * 여기서 틀리면 에러 없이 좋아요가 빠진다. 보내는 중에 눌린 수를 잃거나, 실패한 묶음을 버리거나,
 * 탭을 닫을 때 남은 수를 보내지 않으면 화면에는 올라갔던 숫자가 새로고침 뒤 줄어 있다.
 * 반대로 묶지 못하면 연타가 곧 Firestore 쓰기 폭증이다.
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
    await vi.advanceTimersByTimeAsync(1000);
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
