/**
 * `buildRssFeed` 는 `/rss.xml` 의 본문을 만든다. 리더와 검색엔진이 이 문서로 새 글을 찾는다.
 *
 * 순서가 틀리면 다시 발행한 옛 글이 새 글처럼 맨 위에 뜨고, 이스케이프가 빠지면 제목의 `&` 하나로
 * XML 이 깨져 피드 전체를 읽지 못한다. 둘 다 블로그 화면에서는 보이지 않아 늦게 발견된다.
 */
import { describe, expect, it } from 'vitest';

import { buildRssFeed, escapeXml, toRssDate, type RssPost } from './buildRssFeed';

const SITE = 'https://jaehan.blog';

function post(overrides: Partial<RssPost> = {}): RssPost {
  return {
    title: '글 제목',
    plain_title: '글 제목',
    category: 'react',
    description: '요약',
    createdAt: '2024. 5. 19.',
    ...overrides,
  };
}

function build(posts: RssPost[]) {
  return buildRssFeed({ posts, siteUrl: SITE, title: '사툰사툰', description: '설명' });
}

describe('toRssDate 는 저장된 작성일을 RFC 822 날짜로 바꾼다', () => {
  it.each([
    ['2026. 7. 7.', 'Tue, 07 Jul 2026 00:00:00 +0900'],
    ['2023. 6. 27.', 'Tue, 27 Jun 2023 00:00:00 +0900'],
    ['2024-12-12', 'Thu, 12 Dec 2024 00:00:00 +0900'],
  ])('%s 는 %s 다', (createdAt, expected) => {
    expect(toRssDate(createdAt)).toBe(expected);
  });

  it('읽지 못하는 형식이면 null 이다', () => {
    expect(toRssDate('어제')).toBeNull();
  });
});

describe('escapeXml 은 XML 을 깨는 글자를 엔티티로 바꾼다', () => {
  it('& 를 먼저 바꿔 엔티티가 두 번 바뀌지 않는다', () => {
    expect(escapeXml(`A & <B> "C" 'D'`)).toBe('A &amp; &lt;B&gt; &quot;C&quot; &apos;D&apos;');
  });
});

describe('buildRssFeed 는 글 목록으로 RSS 2.0 문서를 만든다', () => {
  it('작성일 최신순으로 넣는다', () => {
    const xml = build([
      post({ title: '가운데', createdAt: '2024. 5. 7.' }),
      post({ title: '최신', createdAt: '2026. 7. 7.' }),
      post({ title: '가장 옛날', createdAt: '2023. 6. 27.' }),
    ]);
    const titles = [...xml.matchAll(/<item><title>(.*?)<\/title>/g)].map(([, title]) => title);
    expect(titles).toEqual(['최신', '가운데', '가장 옛날']);
  });

  it('작성일을 읽지 못한 글은 pubDate 없이 맨 뒤에 둔다', () => {
    const xml = build([post({ title: '날짜 없음', createdAt: '' }), post({ title: '있음' })]);
    const items = xml.split('<item>').slice(1);
    expect(items[1]).toContain('날짜 없음');
    expect(items[1]).not.toContain('<pubDate>');
  });

  it('링크와 guid 는 상세 페이지 주소를 인코딩한 값이다', () => {
    const xml = build([post({ category: 'react', plain_title: 'useState 동작 원리' })]);
    const link = encodeURI(`${SITE}/posts/react/useState-동작-원리`);
    expect(xml).toContain(`<link>${link}</link>`);
    expect(xml).toContain(`<guid isPermaLink="true">${link}</guid>`);
  });

  it('제목과 요약의 특수문자를 이스케이프한다', () => {
    const xml = build([post({ title: 'A & B', description: '<script>' })]);
    expect(xml).toContain('<title>A &amp; B</title>');
    expect(xml).toContain('<description>&lt;script&gt;</description>');
  });

  it('채널에 자기 주소(atom:link self)를 적는다', () => {
    expect(build([])).toContain(
      `<atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />`,
    );
  });
});
