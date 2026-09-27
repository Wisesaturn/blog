/**
 * `toSafePathSegment` 는 Storage 경로의 폴더 이름과 파일 이름을 정리하는 규칙 하나다.
 *
 * 여기서 괄호 같은 문자가 남으면 `getStoragePaths` 가 주소에서 경로를 잘못 잘라, 발행 직후 방금 올린
 * 이미지를 옛 파일로 보고 지운다. 응답은 200 이고 이미지만 깨지므로 조용히 실패한다 (#129, #131).
 */
import { describe, expect, it } from 'vitest';

import toSafePathSegment from './toSafePathSegment';

describe('toSafePathSegment 는 경로 조각에 문자, 숫자, -, _ 만 남긴다', () => {
  it.each([
    ['괄호', 'team_(1)', 'team_-1-'],
    ['콜론', 'a:b', 'a-b'],
    ['공백', 'a b', 'a-b'],
    ['슬래시', 'a/b', 'a-b'],
  ])('%s 를 - 로 바꾼다', (_name, input, expected) => {
    expect(toSafePathSegment(input)).toBe(expected);
  });

  it('바꾼 뒤 이어진 - 는 하나로 합친다', () => {
    expect(toSafePathSegment('쌩-npm으로-MFE-구축하기-(1)-:-개념')).toBe(
      '쌩-npm으로-MFE-구축하기-1-개념',
    );
  });

  it('이미 안전한 조각은 그대로 둔다', () => {
    expect(toSafePathSegment('함수-타입-선언하기')).toBe('함수-타입-선언하기');
  });

  it('자모가 나뉜 한글도 합쳐서 그대로 둔다', () => {
    expect(toSafePathSegment('유클러버스'.normalize('NFD'))).toBe('유클러버스');
  });
});
