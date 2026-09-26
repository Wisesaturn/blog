/**
 * `mergeAdjacentBold` 는 굵게 문장 안의 인라인 코드 때문에 생기는 `****` 를 없앤다 (#97).
 *
 * 입력은 "마크다운 테스트"(LOCAL_TEST) 페이지를 notion-to-md 로 뽑은 실제 출력이다. Notion 에서
 * 문장 전체를 한 번에 굵게로 지정해도 코드 부분은 별도 조각이 되어 이 모양이 나온다.
 * 화면은 멀쩡한데 별표만 보이는 조용한 실패라 HTML 결과까지 고정한다.
 */
import { describe, expect, it } from 'vitest';

import getHtml from './getHtml';
import mergeAdjacentBold from './mergeAdjacentBold';

const NOTION_OUTPUT = '**이렇게** **`code`****를 쓴다면?**';

describe('붙어 있는 굵게를 하나로 합친다', () => {
  it('**** 를 지운다', () => {
    expect(mergeAdjacentBold(NOTION_OUTPUT)).toBe('**이렇게** **`code`를 쓴다면?**');
  });

  it('HTML 에 별표가 남지 않고 굵게 안에 코드가 들어간다', async () => {
    const html = await getHtml(mergeAdjacentBold(NOTION_OUTPUT));

    expect(html).not.toContain('**');
    expect(html).toContain('<strong><code>code</code>를 쓴다면?</strong>');
  });

  it('합치지 않으면 별표가 그대로 남는다', async () => {
    expect(await getHtml(NOTION_OUTPUT)).toContain('**');
  });
});

describe('코드는 건드리지 않는다', () => {
  it('코드 블록 안의 **** 는 그대로 둔다', () => {
    const input = '```js\nconst a = "****";\n```';

    expect(mergeAdjacentBold(input)).toBe(input);
  });

  it('인라인 코드 안의 **** 는 그대로 둔다', () => {
    expect(mergeAdjacentBold('예시 `****` 입니다')).toBe('예시 `****` 입니다');
  });
});
