/**
 * `filterNotionUrl` 은 발행할 때 본문에서 "우리 저장소로 옮겨야 할 이미지"만 골라낸다.
 *
 * 이미 Storage 에 올라간 이미지를 다시 고르면 발행할 때마다 같은 파일이 새 이름으로 쌓이고,
 * 골라내야 할 Notion 이미지를 놓치면 Notion 의 만료되는 서명 URL 이 본문에 그대로 남아
 * 며칠 뒤 이미지가 깨진다. 양쪽 다 발행 직후에는 멀쩡해 보여서 늦게 발견된다.
 */
import { describe, expect, it } from 'vitest';

import filterNotionUrl from './filterNotionUrl';

const img = (src: string) => `<img src="${src}" alt="">`;

describe('옮겨야 할 이미지를 고른다', () => {
  it('Notion 이 준 URL 을 고른다', () => {
    const src =
      'https://prod-files-secure.s3.us-west-2.amazonaws.com/abc/def.png?X-Amz-Signature=1';

    expect(filterNotionUrl(img(src))).toEqual([src]);
  });

  it('본문에 있는 순서대로 담는다', () => {
    const body = `${img('https://example.com/1.png')}텍스트${img('https://example.com/2.png')}`;

    expect(filterNotionUrl(body)).toEqual([
      'https://example.com/1.png',
      'https://example.com/2.png',
    ]);
  });

  it('img 태그가 없으면 빈 배열이다', () => {
    expect(filterNotionUrl('<p>글만 있다</p>')).toEqual([]);
  });

  it('빈 본문도 빈 배열이다', () => {
    expect(filterNotionUrl('')).toEqual([]);
  });
});

describe('이미 우리 쪽에 있는 이미지는 거른다', () => {
  it.each([
    ['firebasestorage', 'https://firebasestorage.googleapis.com/v0/b/x/o/y.webp?alt=media'],
    ['GCP 공개 URL', 'https://storage.googleapis.com/jaehan-flow.appspot.com/post/a/b.webp'],
    ['giphy', 'https://media.giphy.com/media/abc/giphy.gif'],
  ])('%s 는 고르지 않는다', (_name, src) => {
    expect(filterNotionUrl(img(src))).toEqual([]);
  });

  it('걸러야 할 것과 옮겨야 할 것이 섞여 있으면 옮겨야 할 것만 남는다', () => {
    const body = [
      img('https://storage.googleapis.com/jaehan-flow.appspot.com/post/a/b.webp'),
      img('https://prod-files-secure.s3.us-west-2.amazonaws.com/new.png'),
      img('https://media.giphy.com/media/abc/giphy.gif'),
    ].join('');

    expect(filterNotionUrl(body)).toEqual([
      'https://prod-files-secure.s3.us-west-2.amazonaws.com/new.png',
    ]);
  });
});

describe('태그 모양이 달라도 src 를 찾는다', () => {
  it('src 앞에 다른 속성이 있어도 찾는다', () => {
    const body = '<img class="w-full" loading="lazy" src="https://example.com/a.png">';

    expect(filterNotionUrl(body)).toEqual(['https://example.com/a.png']);
  });

  it('자기 닫는 태그도 찾는다', () => {
    expect(filterNotionUrl('<img src="https://example.com/a.png" />')).toEqual([
      'https://example.com/a.png',
    ]);
  });

  /**
   * 정규식이 큰따옴표만 본다. Notion 이 작은따옴표로 내보내는 일은 없지만,
   * 본문을 손으로 고치면서 작은따옴표를 쓰면 그 이미지는 조용히 안 옮겨진다.
   */
  it('작은따옴표로 적힌 src 는 찾지 못한다', () => {
    expect(filterNotionUrl("<img src='https://example.com/a.png'>")).toEqual([]);
  });
});
