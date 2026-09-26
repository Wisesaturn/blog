/**
 * @description Notion 콜아웃을 본문 HTML 의 콜아웃 틀로 감싼다
 * @param icon 콜아웃 아이콘 이모지. 이미지 아이콘이거나 없으면 빈 문자열
 * @param content 콜아웃 안의 마크다운 (서식과 하위 블록은 notion-to-md 가 만든 그대로)
 * @returns `<aside class="callout">` 로 감싼 마크다운
 *
 * notion-to-md 는 콜아웃을 `> 💡 내용` 인용 문법으로 바꿔서 본문에서 인용과 구분할 수 없었다.
 * 안쪽 내용은 마크다운으로 파싱되어야 하므로 여는 태그와 내용 사이, 내용과 닫는 태그 사이에 빈 줄을 둔다.
 * CommonMark 에서 HTML 블록은 빈 줄까지 이어져서, 빈 줄이 없으면 내용이 HTML 로 취급된다.
 * @example
 * formatCallout('💡', '콜아웃 **강조**');
 */
export default function formatCallout(icon: string, content: string): string {
  const iconTag = icon ? `\n<span class="callout-icon" aria-hidden="true">${icon}</span>` : '';

  return `<aside class="callout">${iconTag}
<div class="callout-content">

${content.trim()}

</div>
</aside>`;
}
