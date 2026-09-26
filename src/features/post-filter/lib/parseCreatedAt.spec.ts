/**
 * `parseCreatedAt` 은 목록 정렬이 쓰는 작성일을 읽는다.
 *
 * 저장된 값은 `Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium' })` 의 결과인 "2024. 5. 19." 이다.
 * V8 은 이 문자열을 `new Date()` 로 읽지만 WebKit(iOS 의 모든 브라우저)은 Invalid Date 를 돌려준다.
 * 그러면 정렬이 조용히 섞이고 서버(Node)와 순서가 달라 hydration 불일치까지 생긴다.
 * 테스트는 Node 에서 돌아 WebKit 의 실패를 재현하지 못하므로, 엔진 파서를 부르지 않는다는 것을 직접 확인한다.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import parseCreatedAt from './parseCreatedAt';

function ymd(date: Date) {
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()];
}

describe('parseCreatedAt 은 저장된 작성일 문자열을 날짜로 읽는다', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([
    ['2024. 5. 19.', [2024, 5, 19]],
    ['2023. 12. 1.', [2023, 12, 1]],
    ['2025. 1. 30.', [2025, 1, 30]],
    // 더미 데이터와 예전 테스트가 쓰는 ISO 형식
    ['2022-01-02T12:00:00Z', [2022, 1, 2]],
    ['2026-03-20', [2026, 3, 20]],
  ])('%s → %j', (input, expected) => {
    expect(ymd(parseCreatedAt(input))).toEqual(expected);
  });

  it('엔진의 날짜 문자열 파서를 거치지 않는다', () => {
    const parse = vi.spyOn(Date, 'parse');

    parseCreatedAt('2024. 5. 19.');

    expect(parse).not.toHaveBeenCalled();
  });

  it.each([[''], ['어제'], ['5. 19. 2024']])('형식이 다른 %j 는 Invalid Date 다', (input) => {
    expect(Number.isNaN(parseCreatedAt(input).getTime())).toBe(true);
  });
});
