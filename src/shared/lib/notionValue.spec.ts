/**
 * `notionValue` 는 Notion 속성에서 발행에 쓸 값을 꺼낸다.
 *
 * SDK 타입에서는 select, date, url 이 null 일 수 있다. 예전 코드는 항상 값이 있다고 보고 읽어서
 * 값이 빈 페이지를 발행하면 도중에 터지거나, 빈 제목이 Firestore 문서 ID 가 될 수 있었다.
 * 꼭 필요한 값은 에러로 멈추고, 없어도 되는 값은 빈 값으로 두는지를 여기서 고정한다.
 */
import { type PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { describe, expect, it } from 'vitest';

import { getCoverUrl, getFirstPlainText, getIconEmoji, requireNotionValue } from './notionValue';

type RichText = Parameters<typeof getFirstPlainText>[0];

const text = (plainText: string) => ({ type: 'text', plain_text: plainText }) as RichText[number];

describe('getFirstPlainText 는 리치 텍스트의 첫 조각만 꺼낸다', () => {
  it('조각이 여럿이어도 첫 조각만 돌려준다', () => {
    expect(getFirstPlainText([text('useState '), text('동작 원리')])).toBe('useState ');
  });

  it('비어 있으면 undefined 다', () => {
    expect(getFirstPlainText([])).toBeUndefined();
  });
});

describe('requireNotionValue 는 발행에 꼭 필요한 값이 비면 멈춘다', () => {
  it.each([
    ['null', null],
    ['undefined', undefined],
    ['빈 문자열', ''],
  ])('%s 이면 속성 이름을 적은 에러를 낸다', (_, value) => {
    expect(() => requireNotionValue(value, 'category')).toThrow(
      'Notion 페이지의 category 값이 비어 있습니다',
    );
  });

  it('값이 있으면 그대로 돌려준다', () => {
    expect(requireNotionValue('react', 'category')).toBe('react');
  });
});

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
