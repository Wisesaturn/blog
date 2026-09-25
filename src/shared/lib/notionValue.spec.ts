/**
 * `notionValue` 는 Notion 페이지의 아이콘과 커버에서 발행에 쓸 값을 꺼낸다.
 *
 * 예전 코드는 `page.icon?.emoji`, `page.cover?.external?.url` 처럼 종류를 보지 않고 읽었다.
 * 이미지 아이콘이나 Notion 에 올린 커버가 조용히 빠지지 않는지를 여기서 고정한다.
 */
import { type PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { describe, expect, it } from 'vitest';

import { getCoverUrl, getIconEmoji } from './notionValue';

describe('getIconEmoji 는 이모지 아이콘만 꺼낸다', () => {
  it('이모지 아이콘이면 이모지를 돌려준다', () => {
    expect(getIconEmoji({ type: 'emoji', emoji: '🔥' } as PageObjectResponse['icon'])).toBe('🔥');
  });

  it('이미지 아이콘이나 아이콘이 없으면 undefined 다', () => {
    const external = { type: 'external', external: { url: 'https://a.png' } };

    expect(getIconEmoji(external as PageObjectResponse['icon'])).toBeUndefined();
    expect(getIconEmoji(null)).toBeUndefined();
  });
});

describe('getCoverUrl 은 커버 이미지 주소를 꺼낸다', () => {
  it.each([
    ['외부 링크', { type: 'external', external: { url: 'https://a.png' } }, 'https://a.png'],
    [
      'Notion 에 올린 파일',
      { type: 'file', file: { url: 'https://b.png', expiry_time: '' } },
      'https://b.png',
    ],
  ])('%s 이면 그 주소를 돌려준다', (_, cover, url) => {
    expect(getCoverUrl(cover as PageObjectResponse['cover'])).toBe(url);
  });

  it('커버가 없으면 빈 문자열이다. 이때 발행 쪽이 기본 썸네일을 쓴다', () => {
    expect(getCoverUrl(null)).toBe('');
  });
});
