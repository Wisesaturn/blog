/**
 * `getCookie` 는 쿠키 헤더 문자열에서 값 하나를 꺼낸다. 다크모드 초기값과 조회수 중복 방지가
 * 이 함수에 걸려 있다.
 *
 * 정규식으로 찾기 때문에 **이름이 다른 쿠키 이름의 뒷부분과 겹치면 엉뚱한 값을 꺼낸다.**
 * 쿠키 이름이 URL 경로에서 만들어지는 구조라 실제로 겹칠 수 있어서 여기서 드러내 둔다.
 */
import { describe, expect, it } from 'vitest';

import getCookie from './getCookieOnHeader';

describe('쿠키 값을 꺼낸다', () => {
  it('하나만 있을 때 꺼낸다', () => {
    expect(getCookie('version=dark', 'version')).toBe('dark');
  });

  it('여러 개 중에서 찾는다', () => {
    expect(getCookie('a=1; version=dark; b=2', 'version')).toBe('dark');
  });

  it('맨 앞에 있어도 찾는다', () => {
    expect(getCookie('version=dark; a=1', 'version')).toBe('dark');
  });

  it('맨 뒤에 있어도 찾는다', () => {
    expect(getCookie('a=1; version=dark', 'version')).toBe('dark');
  });

  it('값이 비어 있으면 빈 문자열을 돌려준다', () => {
    expect(getCookie('version=; a=1', 'version')).toBe('');
  });
});

describe('없을 때', () => {
  it('헤더가 null 이면 null 이다', () => {
    expect(getCookie(null, 'version')).toBeNull();
  });

  it('헤더가 비어 있으면 null 이다', () => {
    expect(getCookie('', 'version')).toBeNull();
  });

  it('찾는 이름이 없으면 null 이다', () => {
    expect(getCookie('a=1; b=2', 'version')).toBeNull();
  });
});

describe('이름이 겹칠 때', () => {
  /**
   * `(?<=이름=)[^;]*` 로 찾기 때문에 앞쪽에 글자가 더 붙어 있어도 맞다고 본다.
   * `theme` 을 찾는데 `color-theme` 이 먼저 나오면 그 값을 가져온다.
   */
  it('찾는 이름으로 끝나는 다른 쿠키의 값을 가져온다', () => {
    expect(getCookie('color-theme=dark; theme=light', 'theme')).toBe('dark');
  });

  it('찾는 이름으로 시작하는 다른 쿠키는 영향이 없다', () => {
    expect(getCookie('versionCode=1; version=dark', 'version')).toBe('dark');
  });
});
