import { describe, expect, it } from 'vitest';

import { parseStatPath, toStatId } from './statKey';

/**
 * `toStatId` 와 `parseStatPath` 는 콘텐츠와 통계 문서를 잇는다.
 *
 * 여기서 틀리면 조회수와 좋아요가 엉뚱한 문서에 쌓이거나, 이전한 조회수를 찾지 못해 0 으로 보인다.
 * 에러 없이 숫자만 틀리므로 조용히 실패한다. 이전 스크립트와 API 가 같은 함수를 써야 한다.
 */

describe('toStatId 는 종류와 키로 Firestore 문서 ID 를 만든다', () => {
  it.each([
    ['post', 'react/글-제목', 'post:react:글-제목'],
    ['snippet', 'createSafeContext', 'snippet:createSafeContext'],
    ['project', '유클러버스', 'project:유클러버스'],
  ] as const)('%s %s → %s', (kind, key, id) => {
    expect(toStatId({ kind, key })).toBe(id);
  });

  it('ID 에 / 가 남지 않는다. Firestore 문서 ID 에서 / 는 경로 구분자다', () => {
    expect(toStatId({ kind: 'post', key: 'react/글-제목' })).not.toContain('/');
  });

  it('제목의 : 는 그대로 두고, 카테고리와 제목이 달라지면 ID 도 달라진다', () => {
    expect(toStatId({ kind: 'post', key: 'react/useLens-파헤치기-:-구조' })).toBe(
      'post:react:useLens-파헤치기-:-구조',
    );
    expect(toStatId({ kind: 'post', key: 'react/a' })).not.toBe(
      toStatId({ kind: 'post', key: 'nextjs/a' }),
    );
  });
});

describe('parseStatPath 는 splat 경로를 콘텐츠 키와 동작으로 나눈다', () => {
  it.each([
    ['post', 'react/글-제목', 'react/글-제목', null],
    ['post', 'react/글-제목/view', 'react/글-제목', 'view'],
    ['post', 'react/글-제목/like', 'react/글-제목', 'like'],
    ['snippet', 'createSafeContext', 'createSafeContext', null],
    ['snippet', 'createSafeContext/view', 'createSafeContext', 'view'],
    ['project', '유클러버스/like', '유클러버스', 'like'],
  ] as const)('%s "%s" → key %s, 동작 %s', (kind, splat, key, operation) => {
    expect(parseStatPath({ kind, splat })).toEqual({ key, operation });
  });

  it.each([
    ['post', 'react', '글은 카테고리와 제목 두 조각이어야 한다'],
    ['post', 'react/글/delete', '모르는 동작'],
    ['post', 'react/글/view/x', '동작 뒤에 더 있다'],
    ['snippet', 'a/b', '스니펫 키 뒤의 b 는 동작이 아니다'],
    ['post', 'react//view', '빈 조각'],
    ['snippet', '', '빈 경로'],
  ] as const)('%s "%s" 는 null 이다 (%s)', (kind, splat, _reason) => {
    expect(parseStatPath({ kind, splat })).toBeNull();
  });
});
