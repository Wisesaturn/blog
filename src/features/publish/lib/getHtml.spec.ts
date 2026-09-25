/**
 * `getHtml` 은 Notion 에서 받은 마크다운을 Firestore 에 저장할 HTML 로 굽는다.
 * 글 본문은 이 결과 그대로 화면에 나가므로, 여기서 빠진 것은 글을 다시 발행하기 전까지 복구되지 않는다.
 *
 * 체인이 길다. remark 로 파싱해 GFM 과 줄바꿈, 수식을 얹고, rehype 로 넘겨 heading 에 id 를 붙이고
 * 코드를 하이라이팅한 뒤, `HtmlConverter` 가 링크와 코드 블록을 마무리한다. 플러그인 하나가 순서에서
 * 밀리거나 빠지면 나머지는 멀쩡하게 돌아가고 그 기능만 조용히 사라진다.
 *
 * 특히 이 체인은 빌드 방식에 민감했다. 클래식 컴파일러 시절에는 여기 쓰이는 micromark 와 mdast,
 * hast 계열 패키지를 `serverDependenciesToBundle` 에 120줄로 나열해야 했다. 번들러를 건드릴 때마다
 * 가장 먼저 깨질 자리라 각 기능이 실제로 나오는지 고정해 둔다.
 */
import { describe, expect, it } from 'vitest';

import getHtml from './getHtml';

/** 코드 블록에 붙는 복사 버튼은 길고 내용 검증과 무관해 걷어내고 본다. */
const stripCopyButton = (html: string) =>
  html.replace(/<button class="copy-code-btn"[\s\S]*?<\/button>/g, '');

describe('heading 에 id 를 붙인다', () => {
  it('목차가 걸 수 있도록 id 가 생긴다', async () => {
    const html = await getHtml('## 들어가며');

    expect(html).toMatch(/<h2[^>]*id="[^"]+"/);
  });

  /**
   * 이 블로그의 글 제목은 대부분 한글이다. slug 가 비면 목차 링크가 전부 같은 곳을 가리킨다.
   */
  it('한글 제목도 id 가 비지 않는다', async () => {
    const html = await getHtml('## 비동기 프로그래밍 파헤치기');

    const id = html.match(/<h2[^>]*id="([^"]*)"/)?.[1];

    expect(id).toBeTruthy();
    expect(id).not.toBe('');
  });

  it('서로 다른 제목은 서로 다른 id 를 받는다', async () => {
    const html = await getHtml('## 첫 번째\n\n## 두 번째');

    const ids = [...html.matchAll(/<h2[^>]*id="([^"]*)"/g)].map((m) => m[1]);

    expect(ids).toHaveLength(2);
    expect(ids[0]).not.toBe(ids[1]);
  });
});

describe('코드 블록', () => {
  it('언어를 class 로 남긴다', async () => {
    const html = await getHtml('```ts\nconst a = 1;\n```');

    expect(html).toContain('language-ts');
  });

  it('구문을 토큰으로 쪼개 하이라이팅한다', async () => {
    const html = await getHtml('```ts\nconst a = 1;\n```');

    expect(html).toMatch(/class="[^"]*token[^"]*"/);
  });

  it('줄 번호를 붙인다', async () => {
    const html = await getHtml('```ts\nconst a = 1;\nconst b = 2;\n```');

    expect(html).toMatch(/line="1"/);
    expect(html).toMatch(/line="2"/);
  });

  /**
   * 복사 버튼을 `pre` 안이 아니라 감싸는 wrapper 의 자식으로 둔다.
   * `pre` 안에 있으면 가로 스크롤이 생겼을 때 버튼이 함께 밀려 화면 밖으로 나간다.
   */
  it('복사 버튼이 pre 를 감싸는 wrapper 안에 들어간다', async () => {
    const html = await getHtml('```ts\nconst a = 1;\n```');

    expect(html).toMatch(/<div class="code-block-wrapper"><button class="copy-code-btn"/);
    expect(html).toMatch(/<\/button><pre/);
  });

  it('코드 블록이 여럿이면 각각에 버튼이 붙는다', async () => {
    const html = await getHtml('```ts\na\n```\n\n```js\nb\n```');

    expect(html.match(/copy-code-btn/g)).toHaveLength(2);
  });

  it('언어가 없는 코드 블록에는 버튼을 붙이지 않는다', async () => {
    const html = await getHtml('```\n그냥 글\n```');

    expect(html).not.toContain('code-block-wrapper');
  });
});

describe('GFM 문법', () => {
  it('표를 table 로 만든다', async () => {
    const html = await getHtml('| 가 | 나 |\n| --- | --- |\n| 1 | 2 |');

    expect(html).toContain('<table>');
    expect(html).toContain('<th');
  });

  it('체크박스를 input 으로 만든다', async () => {
    const html = await getHtml('- [ ] 할 일\n- [x] 끝난 일');

    expect(html).toMatch(/<input[^>]*type="checkbox"/);
    expect(html).toMatch(/<input[^>]*checked/);
  });

  it('취소선을 del 로 만든다', async () => {
    const html = await getHtml('~~지운 글~~');

    expect(html).toContain('<del>지운 글</del>');
  });
});

describe('수식', () => {
  it('인라인 수식을 그린다', async () => {
    const html = await getHtml('공식은 $E = mc^2$ 입니다');

    expect(html).toContain('<mjx-container');
    expect(html).toContain('<svg');
  });

  it('블록 수식을 그린다', async () => {
    const html = await getHtml('$$\n\\frac{1}{3}\n$$');

    expect(html).toContain('<mjx-container');
  });
});

describe('줄바꿈', () => {
  /**
   * `remark-breaks` 가 없으면 한 줄 띄지 않은 줄바꿈이 무시되어 문단이 한 덩어리로 붙는다.
   * Notion 에서 쓴 그대로 보이게 하려고 넣은 플러그인이다.
   */
  it('한 줄 띄지 않은 줄바꿈도 br 이 된다', async () => {
    const html = await getHtml('첫 줄\n둘째 줄');

    expect(html).toContain('<br>');
  });
});

describe('링크', () => {
  it('링크를 새 탭으로 연다', async () => {
    const html = await getHtml('[블로그](https://jaehan.blog)');

    expect(html).toMatch(/<a target="_blank"[^>]*href="https:\/\/jaehan\.blog"/);
  });

  it('자동 링크에도 붙는다', async () => {
    const html = await getHtml('https://example.com');

    expect(html).toMatch(/<a target="_blank"/);
  });

  /**
   * `HtmlConverter.link()` 가 한때 `<a` 를 문자열로 찾아 바꿨다. 태그 경계를 보지 않아
   * `a` 로 시작하는 다른 태그의 앞부분까지 걸려 `<aside>` 가 `<a target="_blank"side>` 로 부서졌다.
   *
   * 본문의 raw HTML 은 `allowDangerousHtml` 로 그대로 통과하므로 Notion 에 `<aside>` 한 줄만
   * 써도 그 글이 깨진다. 지금은 `<a` 뒤에 공백이나 `>` 가 오는 경우만 바꾼다.
   */
  it.each([['aside'], ['abbr'], ['address'], ['article'], ['audio']])(
    '%s 태그를 링크로 오인하지 않는다',
    async (tag) => {
      const html = await getHtml(`<${tag}>내용</${tag}>`);

      expect(html).toContain(`<${tag}>`);
      expect(html).not.toContain('target="_blank"');
    },
  );

  /**
   * raw HTML 블록 안의 마크다운은 CommonMark 규칙상 파싱되지 않으므로 문단을 나눠 넣는다.
   */
  it('a 로 시작하는 태그와 진짜 링크가 한 글에 있어도 링크만 바뀐다', async () => {
    const html = await getHtml('<aside>주석</aside>\n\n[블로그](https://jaehan.blog)');

    expect(html).toContain('<aside>');
    expect(html.match(/target="_blank"/g)).toHaveLength(1);
  });
});

describe('빈 입력', () => {
  it('빈 문자열을 넣어도 터지지 않는다', async () => {
    await expect(getHtml('')).resolves.toBeTypeOf('string');
  });

  it('공백만 있어도 터지지 않는다', async () => {
    await expect(getHtml('   \n  ')).resolves.toBeTypeOf('string');
  });
});

describe('여러 문법이 섞인 글', () => {
  it('한 글 안에서 서로를 밀어내지 않는다', async () => {
    const md = [
      '## 제목',
      '',
      '본문과 $x^2$ 수식',
      '',
      '```ts',
      'const a = 1;',
      '```',
      '',
      '| 가 | 나 |',
      '| --- | --- |',
      '| 1 | 2 |',
      '',
      '[링크](https://jaehan.blog)',
    ].join('\n');

    const html = stripCopyButton(await getHtml(md));

    expect(html).toMatch(/<h2[^>]*id="[^"]+"/);
    expect(html).toContain('<mjx-container');
    expect(html).toContain('language-ts');
    expect(html).toContain('<table>');
    expect(html).toMatch(/<a target="_blank"/);
  });
});
