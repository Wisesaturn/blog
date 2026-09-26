import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import useDarkmode from '@/commons/model/useDarkmode';

import DarkmodeButton from './DarkmodeButton';

/**
 * 다크 모드 버튼은 사용자가 고른 값을 localStorage 에만 남기고 `<html color-theme>` 를 바꾼다.
 * 서버로 가는 쿠키를 심으면 다시 서버 응답에 테마가 실릴 길이 열리므로 쿠키를 쓰지 않는 것도 확인한다 (#106).
 *
 * 댓글(Giscus)은 `useDarkmode` 로 테마를 읽는다. 버튼이 상태가 아니라 문서를 바꾸므로,
 * 훅이 문서 변경을 따라오지 않으면 댓글만 이전 테마로 남는다.
 */

type MediaListener = (event: { matches: boolean }) => void;

let systemDark = false;
let mediaListeners: MediaListener[] = [];

function mockMatchMedia() {
  window.matchMedia = ((query: string) => ({
    get matches() {
      return systemDark;
    },
    media: query,
    addEventListener: (_: string, fn: MediaListener) => mediaListeners.push(fn),
    removeEventListener: (_: string, fn: MediaListener) => {
      mediaListeners = mediaListeners.filter((l) => l !== fn);
    },
  })) as unknown as typeof window.matchMedia;
}

async function changeSystemTheme(dark: boolean) {
  systemDark = dark;
  await act(async () => {
    mediaListeners.forEach((l) => l({ matches: dark }));
  });
}

function ThemeProbe() {
  return <p>theme:{useDarkmode()}</p>;
}

beforeEach(() => {
  localStorage.clear();
  systemDark = false;
  mediaListeners = [];
  mockMatchMedia();
  document.documentElement.setAttribute('color-theme', 'light');
});

describe('버튼을 누르면 고른 테마를 이 브라우저에만 남긴다', () => {
  it('문서의 테마와 localStorage 가 바뀌고 쿠키는 생기지 않는다', async () => {
    render(<DarkmodeButton />);

    await userEvent.click(screen.getByRole('button', { name: 'darkmode-button' }));

    expect(document.documentElement.getAttribute('color-theme')).toBe('dark');
    expect(localStorage.getItem('color-theme')).toBe('dark');
    expect(document.cookie).not.toMatch(/color-theme=/);
  });

  it('useDarkmode 를 쓰는 곳이 바뀐 테마로 다시 그려진다', async () => {
    render(
      <>
        <DarkmodeButton />
        <ThemeProbe />
      </>,
    );
    expect(screen.getByText('theme:light')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'darkmode-button' }));

    expect(await screen.findByText('theme:dark')).toBeInTheDocument();
  });
});

describe('직접 고른 값이 없을 때만 시스템 설정 변경을 따라간다', () => {
  it('고른 값이 없으면 시스템이 dark 로 바뀔 때 따라 바뀐다', async () => {
    render(<DarkmodeButton />);

    await changeSystemTheme(true);

    expect(document.documentElement.getAttribute('color-theme')).toBe('dark');
  });

  it('light 를 골랐으면 시스템이 dark 로 바뀌어도 그대로다', async () => {
    localStorage.setItem('color-theme', 'light');
    render(<DarkmodeButton />);

    await changeSystemTheme(true);

    expect(document.documentElement.getAttribute('color-theme')).toBe('light');
  });
});

describe('다른 탭에서 고른 테마를 이 탭에도 적용한다', () => {
  it('storage 이벤트가 오면 저장된 값으로 바뀐다', async () => {
    render(<DarkmodeButton />);

    localStorage.setItem('color-theme', 'dark');
    await act(async () => {
      window.dispatchEvent(new StorageEvent('storage', { key: 'color-theme', newValue: 'dark' }));
    });

    expect(document.documentElement.getAttribute('color-theme')).toBe('dark');
  });
});

describe('아이콘은 상태가 아니라 dark: 클래스로 고른다', () => {
  /**
   * 서버는 테마를 모른다. 상태로 아이콘을 고르면 하이드레이션 전까지 다크 화면에 해 아이콘이 보인다.
   * 두 아이콘을 모두 그리고 `dark:` 클래스가 보일 것을 정하므로, 이 클래스가 동작을 결정한다.
   */
  it('달 아이콘은 dark 에서만, 해 아이콘은 light 에서만 보인다', () => {
    render(<DarkmodeButton />);

    const [moon, sun] = screen.getByRole('button', { name: 'darkmode-button' }).children;
    expect(moon).toHaveClass('hidden', 'dark:block');
    expect(sun).toHaveClass('block', 'dark:hidden');
  });
});
