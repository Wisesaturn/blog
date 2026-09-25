/**
 * `getHeading` 은 본문 HTML 에서 목차(TOC)를 뽑는다.
 *
 * 본문 HTML 은 발행 시점에 remark, rehype 파이프라인이 만들고 Firestore 에 그대로 저장된다.
 * 그 파이프라인의 `rehype-slug` 가 heading 에 `id` 를 붙이는데, 이 함수는 **id 가 붙은
 * heading 만** 찾는다. 파이프라인 설정이 바뀌어 id 가 사라지면 목차가 조용히 빈 배열이 된다.
 */
import { describe, expect, it } from 'vitest';

import getHeading from './getHeading';

describe('id 가 붙은 h2 부터 h4 까지 뽑는다', () => {
  it('level 과 id, text 를 담는다', () => {
    const body = '<h2 id="intro">들어가며</h2>';

    expect(getHeading(body)).toEqual([{ level: 2, id: 'intro', text: '들어가며' }]);
  });

  it.each([
    [2, '<h2 id="a">A</h2>'],
    [3, '<h3 id="a">A</h3>'],
    [4, '<h4 id="a">A</h4>'],
  ])('h%i 를 뽑는다', (level, body) => {
    expect(getHeading(body)).toEqual([{ level, id: 'a', text: 'A' }]);
  });

  it('본문에 나온 순서대로 담는다', () => {
    const body = '<h2 id="a">A</h2><p>글</p><h3 id="b">B</h3><h2 id="c">C</h2>';

    expect(getHeading(body).map((h) => h.id)).toEqual(['a', 'b', 'c']);
  });

  it('작은따옴표로 적힌 id 도 읽는다', () => {
    expect(getHeading("<h2 id='a'>A</h2>")).toEqual([{ level: 2, id: 'a', text: 'A' }]);
  });

  it('id 뒤에 다른 속성이 있어도 읽는다', () => {
    expect(getHeading('<h2 id="a" class="mt-4">A</h2>')).toEqual([
      { level: 2, id: 'a', text: 'A' },
    ]);
  });
});

describe('목차에 넣지 않는 것', () => {
  it('h1 과 h5 는 뽑지 않는다', () => {
    expect(getHeading('<h1 id="a">A</h1><h5 id="b">B</h5>')).toEqual([]);
  });

  it('id 가 없는 heading 은 뽑지 않는다', () => {
    expect(getHeading('<h2>제목만 있다</h2>')).toEqual([]);
  });

  it('heading 이 없으면 빈 배열이다', () => {
    expect(getHeading('<p>글만 있다</p>')).toEqual([]);
  });

  it('빈 본문도 빈 배열이다', () => {
    expect(getHeading('')).toEqual([]);
  });
});

describe('text 는 태그를 벗기지 않는다', () => {
  /**
   * heading 안에 `<code>` 나 `<strong>` 이 있으면 마크업이 그대로 딸려 온다.
   * 목차에 그리는 쪽이 이 문자열을 그대로 렌더하면 태그가 글자로 보인다.
   */
  it('heading 안의 태그가 문자열에 그대로 남는다', () => {
    const body = '<h2 id="a"><code>useLens</code> 파헤치기</h2>';

    expect(getHeading(body)[0].text).toBe('<code>useLens</code> 파헤치기');
  });
});

describe('여러 줄에 걸친 본문', () => {
  it('heading 사이에 줄바꿈이 있어도 찾는다', () => {
    const body = ['<h2 id="a">A</h2>', '<p>글</p>', '<h3 id="b">B</h3>'].join('\n');

    expect(getHeading(body)).toHaveLength(2);
  });
});
