import { describe, expect, it } from 'vitest';

import postStatKey from './postStatKey';

/**
 * `postStatKey` 는 목록의 글 행을 통계 API 응답의 키와 잇는다.
 *
 * 어긋나면 목록의 조회수와 좋아요가 에러 없이 0 으로 보인다. 발행이 만드는 문서 ID, 상세 URL, 이전한 통계 문서의
 * 키가 모두 `plain_title` 의 공백을 `-` 로 바꾼 값이다.
 */

describe('postStatKey 는 카테고리와 문서 ID 로 통계 키를 만든다', () => {
  it.each([
    ['react', 'useState 동작 원리와 클로저', 'react/useState-동작-원리와-클로저'],
    [
      'frontend',
      '내 컴포넌트가 갑자기 깨져 보여요 : SubPixel Rendering 이슈 해결하기',
      'frontend/내-컴포넌트가-갑자기-깨져-보여요-:-SubPixel-Rendering-이슈-해결하기',
    ],
    ['nextjs', '연속  공백', 'nextjs/연속-공백'],
  ])('%s "%s" → %s', (category, title, key) => {
    expect(postStatKey({ category, plain_title: title })).toBe(key);
  });
});
