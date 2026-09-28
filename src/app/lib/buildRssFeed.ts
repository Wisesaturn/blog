import { parseCreatedAt } from '@/features/post-filter';

import { type IPost } from '@/entities/post';

import convertString from '@/commons/lib/convertString';

export type RssPost = Pick<
  IPost,
  'title' | 'plain_title' | 'category' | 'description' | 'createdAt'
>;

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * @description XML 텍스트와 속성 값에 들어갈 문자열의 특수문자를 엔티티로 바꾼다
 * @param value 바꿀 문자열
 * @returns 이스케이프한 문자열
 * @example
 * escapeXml('A & <B>'); // 'A &amp; &lt;B&gt;'
 */
export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * @description 글의 `createdAt` 을 RSS `pubDate`(RFC 822) 로 바꾼다
 *
 * 저장된 값에는 시간이 없어 그날 0시(KST)로 적는다. `parseCreatedAt` 은 서버의 로컬 시간으로 날짜를 만들지만
 * 연, 월, 일, 요일을 같은 로컬 시간으로 다시 읽으므로 서버 시간대와 상관없이 결과가 같다.
 * @param createdAt "YYYY. M. D." 형식의 작성일
 * @returns RFC 822 날짜 문자열. 형식이 맞지 않으면 `null`
 * @example
 * toRssDate('2026. 7. 7.'); // 'Tue, 07 Jul 2026 00:00:00 +0900'
 */
export function toRssDate(createdAt: string): string | null {
  const date = parseCreatedAt(createdAt);
  if (Number.isNaN(date.getTime())) return null;

  const day = String(date.getDate()).padStart(2, '0');
  return `${WEEKDAYS[date.getDay()]}, ${day} ${MONTHS[date.getMonth()]} ${date.getFullYear()} 00:00:00 +0900`;
}

/**
 * @description 글 목록으로 RSS 2.0 피드 문서를 만든다
 *
 * 정렬은 `createdAt` 최신순이다. `lastmod` 는 다시 발행하면 한꺼번에 바뀌어 옛 글이 위로 올라온다.
 * 작성일을 읽지 못한 글은 `pubDate` 없이 맨 뒤에 둔다.
 * @param params.posts 넣을 글. 순서는 상관없다
 * @param params.siteUrl 끝에 `/` 가 없는 사이트 주소
 * @param params.title 채널 제목
 * @param params.description 채널 설명
 * @returns RSS 2.0 XML 문자열
 */
export function buildRssFeed({
  posts,
  siteUrl,
  title,
  description,
}: {
  posts: RssPost[];
  siteUrl: string;
  title: string;
  description: string;
}): string {
  const items = posts
    .map((post) => {
      const time = parseCreatedAt(post.createdAt).getTime();
      return { post, time: Number.isNaN(time) ? -Infinity : time };
    })
    .sort((a, b) => b.time - a.time || 0)
    .map(({ post }) => {
      const link = encodeURI(
        `${siteUrl}/posts/${post.category}/${convertString({ str: post.plain_title, type: 'spaceToDash' })}`,
      );
      const pubDate = toRssDate(post.createdAt);
      return [
        '<item>',
        `<title>${escapeXml(post.title)}</title>`,
        `<link>${escapeXml(link)}</link>`,
        `<guid isPermaLink="true">${escapeXml(link)}</guid>`,
        pubDate ? `<pubDate>${pubDate}</pubDate>` : '',
        `<category>${escapeXml(post.category)}</category>`,
        `<description>${escapeXml(post.description)}</description>`,
        '</item>',
      ].join('');
    });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '<channel>',
    `<title>${escapeXml(title)}</title>`,
    `<link>${siteUrl}</link>`,
    `<description>${escapeXml(description)}</description>`,
    '<language>ko</language>',
    `<atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />`,
    ...items,
    '</channel>',
    '</rss>',
  ].join('\n');
}
