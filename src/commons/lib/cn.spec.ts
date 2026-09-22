/**
 * `cn` 은 clsx 로 조건부 클래스를 펴고 tailwind-merge 로 충돌을 정리한다.
 *
 * 두 단계 중 tailwind-merge 가 빠지면 나중에 적은 클래스가 이기지 않고 CSS 규칙 순서대로
 * 이겨버린다. 그러면 variant 로 색을 덮어쓰는 컴포넌트가 조용히 기본값으로 보인다.
 */
import { describe, expect, it } from 'vitest';

import { cn } from './cn';

describe('충돌하는 Tailwind 유틸은 뒤엣것만 남는다', () => {
  it.each([
    ['p-2', 'p-4'],
    ['text-sm', 'text-lg'],
    ['bg-white', 'bg-black'],
    ['flex', 'grid'],
  ])('%s 뒤에 %s 를 적으면 뒤엣것만 남는다', (before, after) => {
    expect(cn(before, after)).toBe(after);
  });

  it('충돌하지 않는 유틸은 둘 다 남는다', () => {
    expect(cn('flex', 'p-4')).toBe('flex p-4');
  });

  it('축약형과 개별형이 충돌하면 뒤엣것이 이긴다', () => {
    expect(cn('px-2', 'p-4')).toBe('p-4');
  });
});

describe('조건부 클래스를 편다', () => {
  it('false 와 null, undefined 는 버린다', () => {
    expect(cn('flex', false, null, undefined, 'p-4')).toBe('flex p-4');
  });

  it('객체 형태에서 참인 키만 남는다', () => {
    expect(cn({ flex: true, hidden: false })).toBe('flex');
  });

  it('배열을 펴서 읽는다', () => {
    expect(cn(['flex', ['p-4', 'text-sm']])).toBe('flex p-4 text-sm');
  });

  it('아무것도 없으면 빈 문자열이다', () => {
    expect(cn()).toBe('');
    expect(cn(false, null, undefined)).toBe('');
  });
});

describe('dark: 같은 변형 접두사는 따로 센다', () => {
  it('접두사가 다르면 충돌로 보지 않는다', () => {
    expect(cn('bg-white', 'dark:bg-black')).toBe('bg-white dark:bg-black');
  });

  it('같은 접두사끼리는 뒤엣것만 남는다', () => {
    expect(cn('dark:bg-white', 'dark:bg-black')).toBe('dark:bg-black');
  });
});
