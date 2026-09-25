/**
 * `convertString` 은 두 곳에서 서로 다른 목적으로 쓰인다.
 *
 * - `spaceToDash`: 글 제목을 URL 경로로 바꾼다. 결과가 달라지면 기존 글 링크가 깨진다
 * - `dashToSpace`: URL 경로에서 제목을 되살린다. meta tag 의 title 이 여기서 나온다
 *
 * 둘 다 실패해도 에러가 나지 않고 링크나 제목만 틀어져 늦게 발견된다. 그래서 여기서 막는다.
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

describe('입력이 문자열이 아니면 에러가 발생한다', () => {
  it.each([[null], [undefined], [123], [{}]])('%s 를 넣으면 Throw 한다', (input) => {
    expect(() => convertString(input as unknown as string, 'spaceToDash')).toThrow(
      '입력받은 문자열이 올바르지 않습니다.',
    );
  });
});
