// 코드 블록과 인라인 코드 안의 **** 는 코드의 일부라 건드리지 않는다
const CODE_RX = /(```[\s\S]*?```|`[^`\n]*`)/g;

/**
 * @description 붙어 있는 굵게 두 개(`**A****B**`)를 하나(`**AB**`)로 합친다
 * @param markdown notion-to-md 가 만든 마크다운
 * @returns `****` 를 지운 마크다운. 코드 안은 그대로다
 *
 * Notion 은 굵게 문장 안에 인라인 코드가 있으면 코드 부분을 별도 조각으로 나눈다
 * (`이렇게 ` bold / `code` bold+code / `를 쓴다면?` bold). notion-to-md 는 조각마다 `**` 를 씌워
 * `**이렇게** **`code`****를 쓴다면?**` 을 만들고, CommonMark 는 별표 네 개를 강조 구분자로 해석하지 못해
 * 기호가 그대로 보인다. Notion 에서 어떻게 써도 조각이 나뉘므로 작성법으로는 피할 수 없다.
 * @example
 * mergeAdjacentBold('**이렇게** **`code`****를 쓴다면?**');
 * // '**이렇게** **`code`를 쓴다면?**'
 */
export default function mergeAdjacentBold(markdown: string): string {
  return markdown
    .split(CODE_RX)
    .map((part, index) => (index % 2 === 1 ? part : part.replace(/\*\*\*\*/g, '')))
    .join('');
}
