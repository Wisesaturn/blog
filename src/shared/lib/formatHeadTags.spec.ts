/**
 * `formatHeadTags` 는 모든 페이지의 meta tag 를 만든다. 검색 노출과 링크 미리보기가 여기 달려 있다.
 *
 * 이 함수는 실패해도 화면이 멀쩡해서 늦게 발견된다. description 이 기본값으로만 들어가던 문제가
 * 실제로 한동안 열려 있었다. 그래서 "어떤 데이터가 들어오면 어떤 값이 나오는지"를 고정해 둔다.
 *
 * og 와 twitter 가 같은 값을 보고 있는지도 함께 본다. 한쪽만 고치고 다른 쪽을 빠뜨리면
 * 플랫폼마다 미리보기가 달라진다.
 */
import { describe, expect, it } from 'vitest';

import { DEFAULT_DESCRIPTION, DEFAULT_THUMBNAIL } from '@/features/post/constant';

import formatHeadTags from './formatHeadTags';

type Args = Parameters<typeof formatHeadTags>[0];

/**
 * `MetaArgs` 는 라우트 매칭 정보까지 요구한다. 이 함수가 실제로 읽는 것은
 * `data` 와 `params` 뿐이라 그 둘만 넘기고 나머지는 생략한다.
 */
function run(overrides: Record<string, unknown> = {}) {
  return formatHeadTags({ data: undefined, params: {}, ...overrides } as unknown as Args);
}

/** `{ title: ... }` 형태의 항목을 찾는다. */
function titleOf(tags: ReturnType<typeof formatHeadTags>) {
  const found = tags.find((t) => 'title' in t) as { title: string } | undefined;
  return found?.title;
}

/** `name` 또는 `property` 가 일치하는 항목의 content 를 찾는다. */
function contentOf(tags: ReturnType<typeof formatHeadTags>, key: string) {
  const found = tags.find(
    (t) => ('name' in t && t.name === key) || ('property' in t && t.property === key),
  ) as { content: string } | undefined;
  return found?.content;
}

function canonicalOf(tags: ReturnType<typeof formatHeadTags>) {
  const found = tags.find((t) => 'rel' in t && t.rel === 'canonical') as
    | { href: string }
    | undefined;
  return found?.href;
}

describe('제목', () => {
  it('params.title 이 있으면 하이픈을 공백으로 되돌려 쓴다', () => {
    const tags = run({ params: { title: 'useLens-파헤치기' }, urlPrefix: 'posts' });

    expect(titleOf(tags)).toBe('useLens 파헤치기 - 사툰사툰 POSTS');
  });

  it('params.title 이 없으면 넘긴 title 을 쓴다', () => {
    const tags = run({ title: 'Posts', urlPrefix: 'posts' });

    expect(titleOf(tags)).toBe('Posts - 사툰사툰');
  });

  it('둘 다 없으면 사툰사툰 이다', () => {
    expect(titleOf(run({}))).toBe('사툰사툰');
  });

  it('카테고리와 제목이 둘 다 있으면 카테고리를 접미사에 넣는다', () => {
    const tags = run({ params: { category: 'react', title: '글-제목' }, urlPrefix: 'posts' });

    expect(titleOf(tags)).toBe('글 제목 - 사툰사툰 REACT');
  });
});

describe('canonical URL', () => {
  it('prefix 만 있으면 prefix 까지만 만든다', () => {
    expect(canonicalOf(run({ urlPrefix: 'posts' }))).toBe('https://jaehan.blog/posts');
  });

  it('카테고리가 있으면 붙인다', () => {
    const tags = run({ params: { category: 'react' }, urlPrefix: 'posts' });

    expect(canonicalOf(tags)).toBe('https://jaehan.blog/posts/react');
  });

  it('카테고리와 제목이 있으면 둘 다 붙인다', () => {
    const tags = run({
      params: { category: 'react', title: 'useLens-파헤치기' },
      urlPrefix: 'posts',
    });

    expect(canonicalOf(tags)).toBe('https://jaehan.blog/posts/react/useLens-파헤치기');
  });

  /**
   * 제목을 공백으로 되돌린 뒤 URL 을 만들고 마지막에 다시 하이픈으로 바꾼다.
   * 그래서 원래 제목에 하이픈이 있어도 URL 은 원래 slug 로 돌아온다.
   */
  it('제목의 공백을 하이픈으로 되돌려 URL 을 만든다', () => {
    const tags = run({ params: { title: '여러-단어-제목' }, urlPrefix: 'posts' });

    expect(canonicalOf(tags)).toBe('https://jaehan.blog/posts/여러-단어-제목');
  });
});

describe('description', () => {
  it('데이터가 없으면 기본 description 을 쓴다', () => {
    expect(contentOf(run({}), 'description')).toBe(DEFAULT_DESCRIPTION);
  });

  it('post 는 description 뒤에 태그를 이어 붙인다', () => {
    const data = { post: { description: '본문 요약', tags: ['react', 'remix'] } };

    expect(contentOf(run({ data }), 'description')).toBe('본문 요약 | react remix');
  });

  it('post 에 태그가 없으면 기본값으로 남는다', () => {
    const data = { post: { description: '본문 요약' } };

    expect(contentOf(run({ data }), 'description')).toBe(DEFAULT_DESCRIPTION);
  });

  it('project 는 description 을 그대로 쓴다', () => {
    const data = { project: { description: '프로젝트 설명' } };

    expect(contentOf(run({ data }), 'description')).toBe('프로젝트 설명');
  });

  it('snippet 은 skills 가 있으면 이어 붙인다', () => {
    const data = { snippet: { description: '스니펫 설명', skills: ['ts', 'css'] } };

    expect(contentOf(run({ data }), 'description')).toBe('스니펫 설명 | ts css');
  });

  it('snippet 에 skills 가 없으면 description 만 쓴다', () => {
    const data = { snippet: { description: '스니펫 설명', skills: [] } };

    expect(contentOf(run({ data }), 'description')).toBe('스니펫 설명');
  });
});

describe('thumbnail', () => {
  it('데이터가 없으면 기본 썸네일을 쓴다', () => {
    expect(contentOf(run({}), 'thumbnail')).toBe(DEFAULT_THUMBNAIL);
  });

  it('post 의 썸네일을 쓴다', () => {
    const data = { post: { thumbnail: 'https://example.com/a.webp' } };

    expect(contentOf(run({ data }), 'thumbnail')).toBe('https://example.com/a.webp');
  });

  it('project 의 썸네일을 쓴다', () => {
    const data = { project: { thumbnail: 'https://example.com/b.webp' } };

    expect(contentOf(run({ data }), 'thumbnail')).toBe('https://example.com/b.webp');
  });

  it('썸네일이 빈 문자열이면 기본값으로 돌아간다', () => {
    const data = { post: { thumbnail: '' } };

    expect(contentOf(run({ data }), 'thumbnail')).toBe(DEFAULT_THUMBNAIL);
  });
});

describe('og 와 twitter 가 같은 값을 본다', () => {
  const data = {
    post: { description: '본문 요약', tags: ['react'], thumbnail: 'https://x/a.webp' },
  };
  const tags = run({ data, params: { category: 'react', title: '글-제목' }, urlPrefix: 'posts' });

  it.each([
    ['제목', 'og:title', 'twitter:title'],
    ['설명', 'og:description', 'twitter:description'],
    ['이미지', 'og:image', 'twitter:image'],
    ['주소', 'og:url', 'twitter:url'],
  ])('%s 가 서로 같다', (_name, ogKey, twitterKey) => {
    expect(contentOf(tags, ogKey)).toBe(contentOf(tags, twitterKey));
    expect(contentOf(tags, ogKey)).toBeTruthy();
  });

  it('og:title 이 title 태그와 같다', () => {
    expect(contentOf(tags, 'og:title')).toBe(titleOf(tags));
  });

  it('og:url 이 canonical 과 같다', () => {
    expect(contentOf(tags, 'og:url')).toBe(canonicalOf(tags));
  });
});

describe('고정으로 들어가는 값', () => {
  it.each([
    ['og:type', 'website'],
    ['og:locale', 'ko_KR'],
    ['og:image:width', '1200'],
    ['og:image:height', '630'],
    ['twitter:card', 'summary'],
  ])('%s 는 %s 다', (key, value) => {
    expect(contentOf(run({}), key)).toBe(value);
  });
});
