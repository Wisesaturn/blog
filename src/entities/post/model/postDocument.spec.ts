/**
 * `postListItem` 은 글 목록과 sitemap 에 들어갈 문서를 고른다.
 *
 * 글 컬렉션에는 `reactions` 만 있는 유령 문서가 있다(2026-09-25 기준 운영 컬렉션에 2건).
 * 이 문서가 통과하면 목록에 제목 없는 행이 생기고 sitemap 이 500 이 된다.
 */
import { expect, it } from 'vitest';

import { postListItem } from './postDocument';

const POST = {
  index: 'id',
  title: '📝 마크다운 테스트',
  plain_title: '마크다운 테스트',
  category: 'LOCAL_TEST',
  description: '',
  tags: [],
  thumbnail: 'https://storage.googleapis.com/x.webp',
  createdAt: '2023. 6. 5.',
  last_editedAt: '2025. 9. 6.',
  lastmod: '2025-09-06',
  body: '<p>본문</p>',
  views: 0,
};

it('reactions 만 있는 유령 문서는 통과하지 못한다', () => {
  expect(postListItem.safeParse({ reactions: { thumbsup: 1 } }).success).toBe(false);
});

it('목록 항목에서는 본문과 reactions 를 뺀다', () => {
  const result = postListItem.parse({ ...POST, reactions: { thumbsup: 1 } });

  expect(result).not.toHaveProperty('body');
  expect(result).not.toHaveProperty('reactions');
});
