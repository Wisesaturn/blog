/**
 * `viewCookieName` 은 조회수 중복 방지 쿠키의 이름을 만든다.
 *
 * 이름이 글끼리 겹치면 한 글을 읽은 사람에게 다른 글의 조회수가 오르지 않는다. 쿠키 이름에 못 쓰는
 * 글자가 섞이면 `Set-Cookie` 가 조용히 무시되어 새로고침할 때마다 조회수가 오른다. 둘 다 화면은
 * 멀쩡하고 숫자만 틀어져서 늦게 발견되므로 여기서 막는다.
 */
import { describe, expect, it } from 'vitest';

import viewCookieName from './viewCookieName';

describe('viewCookieName 은 글마다 다른 쿠키 이름을 만든다', () => {
  /**
   * 예전 방식에서 실제로 겹쳤던 조합이다. 한글 제목이 지워져 둘 다 `posts-typescript` 가 됐다.
   */
  it('같은 카테고리의 한글 제목 글끼리 겹치지 않는다', () => {
    const a = viewCookieName('post', 'typescript/함수-타입-선언하기');
    const b = viewCookieName('post', 'typescript/제네릭-파헤치기');

    expect(a).not.toBe(b);
  });

  it('같은 키면 언제나 같은 이름이다', () => {
    expect(viewCookieName('post', 'react/useLens-파헤치기')).toBe(
      viewCookieName('post', 'react/useLens-파헤치기'),
    );
  });

  it('제목이 같아도 종류가 다르면 다른 이름이다', () => {
    expect(viewCookieName('snippet', '같은-제목')).not.toBe(viewCookieName('project', '같은-제목'));
  });

  it.each([
    ['post', 'typescript/함수-타입-선언하기'],
    ['snippet', 'Array.prototype.at 쓰기'],
    ['project', '유클러버스'],
    ['post', ''],
  ] as const)('%s %s 도 쿠키 이름에 쓸 수 있는 글자만 쓴다', (kind, key) => {
    expect(viewCookieName(kind, key)).toMatch(/^view-(post|snippet|project)-[0-9a-f]{8}$/);
  });
});
