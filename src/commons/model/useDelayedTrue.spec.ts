/**
 * `useDelayedTrue` 는 전체 화면 스피너를 켜고 끄는 플래그를 만든다.
 *
 * 켜는 것과 끄는 것의 타이밍이 서로 다른 게 이 훅의 전부다. 이전에는 일반 디바운스 훅을 써서
 * 끄는 것까지 늦어졌고, 화면이 다 그려진 뒤에도 스피너가 본문을 덮고 있었다. 그게 깜빡임으로
 * 보였다. 그래서 "켜는 것만 늦고 끄는 것은 즉시"를 여기서 고정해 둔다.
 *
 * 스피너는 떠 있어도 에러가 나지 않아서 눈으로만 드러나는 종류의 버그다.
 */
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import useDelayedTrue from './useDelayedTrue';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

/** 타이머를 앞으로 감는다. state 갱신이 뒤따르므로 act 로 감싼다. */
function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

describe('켜는 것은 늦춘다', () => {
  it('처음에는 false 다', () => {
    const { result } = renderHook(() => useDelayedTrue(true, 500));

    expect(result.current).toBe(false);
  });

  it('delay 직전까지 false 로 남는다', () => {
    const { result } = renderHook(() => useDelayedTrue(true, 500));

    advance(499);

    expect(result.current).toBe(false);
  });

  it('delay 를 지나면 true 가 된다', () => {
    const { result } = renderHook(() => useDelayedTrue(true, 500));

    advance(500);

    expect(result.current).toBe(true);
  });

  it('delay 안에 false 로 돌아오면 끝까지 켜지지 않는다', () => {
    const { result, rerender } = renderHook(({ value }) => useDelayedTrue(value, 500), {
      initialProps: { value: true },
    });

    advance(300);
    rerender({ value: false });
    advance(1000);

    expect(result.current).toBe(false);
  });
});

describe('끄는 것은 즉시다', () => {
  /**
   * 이 테스트가 깜빡임의 본체다. 켜진 뒤 false 로 바뀌면 타이머를 기다리지 않고 바로 꺼져야
   * 이미 그려진 화면을 덮지 않는다.
   */
  it('true 였다가 false 가 되면 타이머를 기다리지 않는다', () => {
    const { result, rerender } = renderHook(({ value }) => useDelayedTrue(value, 500), {
      initialProps: { value: true },
    });

    advance(500);
    expect(result.current).toBe(true);

    act(() => {
      rerender({ value: false });
    });

    expect(result.current).toBe(false);
  });
});

describe('다시 켜질 때', () => {
  it('두 번째 켜짐도 delay 를 처음부터 다시 센다', () => {
    const { result, rerender } = renderHook(({ value }) => useDelayedTrue(value, 500), {
      initialProps: { value: true },
    });

    advance(500);
    rerender({ value: false });
    rerender({ value: true });

    advance(499);
    expect(result.current).toBe(false);

    advance(1);
    expect(result.current).toBe(true);
  });
});

describe('기본 delay', () => {
  it('delay 를 넘기지 않으면 500ms 다', () => {
    const { result } = renderHook(() => useDelayedTrue(true));

    advance(499);
    expect(result.current).toBe(false);

    advance(1);
    expect(result.current).toBe(true);
  });
});
