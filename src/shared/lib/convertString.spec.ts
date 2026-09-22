/**
 * `convertString` 은 세 곳에서 서로 다른 목적으로 쓰인다.
 *
 * - `spaceToDash`: 글 제목을 URL 경로로 바꾼다. 결과가 달라지면 기존 글 링크가 깨진다
 * - `dashToSpace`: URL 경로에서 제목을 되살린다. meta tag 의 title 이 여기서 나온다
 * - `urlPathToCookieName`: 조회수 중복 방지 쿠키의 이름을 만든다. 쿠키 이름에 못 쓰는 글자가
 *   섞이면 `Set-Cookie` 가 조용히 무시되어 조회수가 계속 오른다
 *
 * 특히 마지막은 실패해도 에러가 나지 않아 눈에 띄지 않는다. 그래서 여기서 막는다.
 */
import { describe, expect, it } from 'vitest';

import convertString from './convertString';

describe('spaceToDash 는 제목을 URL 경로로 바꾼다', () => {
  it.each([
    ['모르는 채로 완성한다는 건', '모르는-채로-완성한다는-건'],
    ['useLens 파헤치기', 'useLens-파헤치기'],
    ['single', 'single'],
  ])('%s → %s', (input, expected) => {
    expect(convertString(input, 'spaceToDash')).toBe(expected);
  });

  it('연속된 공백을 하나의 하이픈으로 합친다', () => {
    expect(convertString('a   b', 'spaceToDash')).toBe('a-b');
  });

  it('탭과 줄바꿈도 공백으로 본다', () => {
    expect(convertString('a\tb\nc', 'spaceToDash')).toBe('a-b-c');
  });

  it('빈 문자열은 빈 문자열로 남는다', () => {
    expect(convertString('', 'spaceToDash')).toBe('');
  });
});

describe('dashToSpace 는 URL 경로에서 제목을 되살린다', () => {
  it('하이픈을 공백으로 바꾼다', () => {
    expect(convertString('모르는-채로-완성한다는-건', 'dashToSpace')).toBe(
      '모르는 채로 완성한다는 건',
    );
  });

  /**
   * 되돌리기가 손실 없이 되지 않는다. 제목에 원래 하이픈이 있으면 공백으로 바뀌어 돌아온다.
   * meta tag 의 title 이 원본과 달라지는 경로라 알고 있어야 한다.
   */
  it('제목에 원래 하이픈이 있으면 되돌릴 때 공백이 된다', () => {
    const original = 'e2e-테스트 도입기';
    const slug = convertString(original, 'spaceToDash');

    expect(slug).toBe('e2e-테스트-도입기');
    expect(convertString(slug, 'dashToSpace')).toBe('e2e 테스트 도입기');
    expect(convertString(slug, 'dashToSpace')).not.toBe(original);
  });
});

describe('urlPathToCookieName 은 쿠키 이름으로 쓸 수 있는 글자만 남긴다', () => {
  it('경로 구분자를 하이픈으로 바꾸고 앞뒤 하이픈을 걷어낸다', () => {
    expect(convertString('/posts/react/useLens-파헤치기', 'urlPathToCookieName')).toBe(
      'posts-react-useLens',
    );
  });

  it('퍼센트 인코딩을 하이픈으로 바꾼다', () => {
    expect(convertString('/posts/%EA%B8%80', 'urlPathToCookieName')).toBe('posts');
  });

  it('영문과 숫자, 밑줄만 그대로 남는다', () => {
    expect(convertString('/a_1/B2', 'urlPathToCookieName')).toBe('a_1-B2');
  });

  it('연속된 하이픈을 하나로 합친다', () => {
    expect(convertString('a///b', 'urlPathToCookieName')).toBe('a-b');
  });

  it('남는 글자가 없으면 page 로 대체한다', () => {
    expect(convertString('/', 'urlPathToCookieName')).toBe('page');
    expect(convertString('///', 'urlPathToCookieName')).toBe('page');
  });

  /**
   * 한글 제목은 전부 하이픈으로 날아간다. 그래서 같은 카테고리의 서로 다른 한글 제목 글이
   * 같은 쿠키 이름을 갖는다. 한 글을 보면 같은 카테고리의 다른 한글 제목 글도 조회수가
   * 오르지 않는다는 뜻이다.
   */
  it('한글만 다른 두 경로가 같은 쿠키 이름이 된다', () => {
    const a = convertString('/posts/react/첫번째글', 'urlPathToCookieName');
    const b = convertString('/posts/react/두번째글', 'urlPathToCookieName');

    expect(a).toBe(b);
  });
});

describe('입력이 문자열이 아니면 에러가 발생한다', () => {
  it.each([[null], [undefined], [123], [{}]])('%s 를 넣으면 Throw 한다', (input) => {
    expect(() => convertString(input as unknown as string, 'spaceToDash')).toThrow(
      '입력받은 문자열이 올바르지 않습니다.',
    );
  });
});
