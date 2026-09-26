import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { THEME_SCRIPT, applyTheme, getDocumentTheme, resolveTheme } from './theme';

/**
 * `THEME_SCRIPT` 는 페인트 전에 `<html color-theme>` 를 정한다. 여기가 틀리면 화면은 멀쩡히 그려지는데
 * 테마만 틀리므로 조용히 실패한다.
 *
 * 규칙은 "직접 고른 값(localStorage) → 시스템 설정" 순서다. 서버 응답은 보지 않는다.
 * 예전에는 쿠키를 서버가 읽어 root loader 로 내려보냈고, 구운 `.data` 와 CDN 캐시가 테마를 덮어썼다 (#106).
 *
 * v2 가 방문마다 자동으로 심은 `color-theme` 쿠키는 사용자가 고른 값과 구분할 수 없다.
 * 옮기면 시스템을 다크로 바꾼 사람이 v2 가 심은 `light` 에 묶이므로 읽지 않고 지운다.
 */

function setSystemTheme(theme: 'dark' | 'light') {
  window.matchMedia = ((query: string) => ({
    matches: query === '(prefers-color-scheme: dark)' && theme === 'dark',
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia;
}

function runThemeScript() {
  new Function(THEME_SCRIPT)();
}

function clearCookies() {
  document.cookie.split('; ').forEach((c) => {
    const name = c.split('=')[0];
    if (name) document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  });
}

beforeEach(() => {
  localStorage.clear();
  clearCookies();
  document.documentElement.removeAttribute('color-theme');
  document.head.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.remove());
});

afterEach(() => {
  localStorage.clear();
  clearCookies();
});

describe('THEME_SCRIPT 는 직접 고른 값을 시스템 설정보다 먼저 쓴다', () => {
  it.each([
    { stored: 'dark', system: 'light', expected: 'dark' },
    { stored: 'light', system: 'dark', expected: 'light' },
    { stored: null, system: 'dark', expected: 'dark' },
    { stored: null, system: 'light', expected: 'light' },
    { stored: 'blue', system: 'dark', expected: 'dark' },
  ] as const)(
    '저장값 $stored, 시스템 $system 이면 $expected 다',
    ({ stored, system, expected }) => {
      if (stored) localStorage.setItem('color-theme', stored);
      setSystemTheme(system);

      runThemeScript();

      expect(document.documentElement.getAttribute('color-theme')).toBe(expected);
    },
  );
});

describe('THEME_SCRIPT 는 v2 가 남긴 쿠키를 읽지 않고 지운다', () => {
  it('쿠키가 light 여도 시스템이 dark 면 dark 다', () => {
    document.cookie = 'color-theme=light; path=/';
    setSystemTheme('dark');

    runThemeScript();

    expect(document.documentElement.getAttribute('color-theme')).toBe('dark');
    expect(document.cookie).not.toMatch(/color-theme=/);
  });

  it('쿠키를 localStorage 로 옮기지 않는다', () => {
    document.cookie = 'color-theme=dark; path=/';
    setSystemTheme('light');

    runThemeScript();

    expect(localStorage.getItem('color-theme')).toBeNull();
    expect(document.documentElement.getAttribute('color-theme')).toBe('light');
  });
});

describe('THEME_SCRIPT 는 주소창 색(theme-color)도 테마에 맞춘다', () => {
  it.each([
    { system: 'dark', color: '#222' },
    { system: 'light', color: '#fff' },
  ] as const)('$system 이면 $color 다', ({ system, color }) => {
    setSystemTheme(system);

    runThemeScript();

    expect(document.querySelector('meta[name="theme-color"]')).toHaveAttribute('content', color);
  });
});

describe('localStorage 를 쓸 수 없어도 시스템 설정으로 테마를 정한다', () => {
  it('저장소 접근이 예외를 던지면 시스템 설정을 따른다', () => {
    const original = Object.getOwnPropertyDescriptor(window, 'localStorage');
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() {
        throw new Error('SecurityError');
      },
    });
    setSystemTheme('dark');

    try {
      runThemeScript();
      expect(document.documentElement.getAttribute('color-theme')).toBe('dark');
      expect(resolveTheme()).toBe('dark');
    } finally {
      if (original) Object.defineProperty(window, 'localStorage', original);
    }
  });
});

describe('applyTheme 는 문서의 테마와 주소창 색을 함께 바꾼다', () => {
  it('meta 가 하나만 남고 값이 바뀐다', () => {
    setSystemTheme('light');
    runThemeScript();

    applyTheme('dark');

    expect(getDocumentTheme()).toBe('dark');
    const metas = document.querySelectorAll('meta[name="theme-color"]');
    expect(metas).toHaveLength(1);
    expect(metas[0]).toHaveAttribute('content', '#222');
  });
});
