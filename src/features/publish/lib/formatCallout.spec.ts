/**
 * `formatCallout` 은 Notion 콜아웃을 인용과 구분되는 `<aside class="callout">` 로 감싼다 (#99).
 *
 * notion-to-md 는 콜아웃을 `> 💡 내용` 인용 문법으로 바꿔서 인용과 같은 HTML 이 나왔다.
 * 틀만 HTML 이고 안쪽은 마크다운이라, 빈 줄이 빠지면 안쪽 굵게와 목록이 파싱되지 않고 기호가 그대로
 * 보인다 (#97 의 토글과 같은 원인). 그래서 HTML 로 바꿨을 때의 모양까지 고정한다.
 */
import { describe, expect, it } from 'vitest';

import formatCallout from './formatCallout';
import getHtml from './getHtml';

describe('콜아웃을 인용과 다른 틀로 감싼다', () => {
  it('aside.callout 안에 아이콘과 내용이 들어간다', async () => {
    const html = await getHtml(formatCallout('💡', '콜아웃 테스트'));

    expect(html).toContain('<aside class="callout">');
    expect(html).toContain('<span class="callout-icon" aria-hidden="true">💡</span>');
    expect(html).toContain('<div class="callout-content">');
    expect(html).not.toContain('<blockquote>');
  });

  it('안쪽의 굵게와 목록이 마크다운으로 파싱된다', async () => {
    const html = await getHtml(formatCallout('💡', '콜아웃 **강조 테스트**\n\n- 항목'));

    expect(html).toContain('<p>콜아웃 <strong>강조 테스트</strong></p>');
    expect(html).toContain('<li>항목</li>');
    expect(html).not.toContain('**');
  });

  it('이모지 아이콘이 없으면 아이콘 자리를 만들지 않는다', async () => {
    const html = await getHtml(formatCallout('', '아이콘 없음'));

    expect(html).toContain('<aside class="callout">');
    expect(html).not.toContain('callout-icon');
  });

  it('일반 인용은 그대로 blockquote 다', async () => {
    const html = await getHtml('> 인용 테스트');

    expect(html).toContain('<blockquote>');
    expect(html).not.toContain('callout');
  });
});
