import rehypeMathjax from 'rehype-mathjax';
import rehypePrismPlus from 'rehype-prism-plus';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

import HtmlConverter from '../helper/HtmlConverter';

/**
 * @summary markdown 문법을 html 태그로 변환하는 함수
 * @param mdString
 * @returns
 */
export default async function getHtml(mdString: string): Promise<string> {
  const result = await unified()
    .use(remarkParse) // markdown을 mdast로 변환
    .use(remarkGfm) // remark가 GFM도 지원 가능하도록
    .use(remarkBreaks) // remark가 line-break도 지원 가능하도록 (마크다운 문법 줄바꿈이 아닌 자연스럽게)
    .use(remarkMath) // math 기호 구분
    .use(remarkRehype, { allowDangerousHtml: true }) // mdast를 hast로 변환
    .use(rehypeStringify, { allowDangerousHtml: true }) // hast를 html 변환
    .use(rehypeSlug) // Header에 Id 값 붙이기
    .use(rehypeMathjax) // math 구문 강조용
    .use(rehypePrismPlus, { showLineNumbers: true }) // code 강조용 (Highlight에서 Prism으로 교체)
    .process(mdString);
  const html = new HtmlConverter(result.value as string).link().process();
  return html;
}
