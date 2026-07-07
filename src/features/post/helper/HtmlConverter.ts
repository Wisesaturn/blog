/**
 * html로 파싱된 문자열 중 n2m.setCustomTransformer로 수행할 수 없는 남은 파싱을 마무리하는 모듈입니다.
 */
class HtmlConverter {
  private result: string;

  constructor(body: string) {
    this.result = body;
  }

  /**
   * link tag for target="_blank"
   */
  link(): this {
    this.result = this.result.replaceAll('<a', '<a target="_blank"');
    return this;
  }

  /**
   * code block copy button injection
   *
   * 복사 버튼은 pre 내부(가로 스크롤 컨테이너)가 아니라 pre를 감싸는 wrapper의
   * 형제 요소로 삽입한다. pre 내부에 두면 overflow-x 스크롤 시 버튼도 스크롤되는
   * 콘텐츠에 포함되어 화면 밖으로 밀려나기 때문이다.
   */
  codeBlock(): this {
    const COPY_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="copy-icon"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
    const CHECK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="check-icon"><polyline points="20 6 9 17 4 12"/></svg>`;

    const btn = `<button class="copy-code-btn" aria-label="Copy code" data-copied="false" onclick="(function(b){var c=b.closest('.code-block-wrapper').querySelector('code');navigator.clipboard.writeText(c.innerText.trim()).then(function(){b.setAttribute('data-copied','true');setTimeout(function(){b.setAttribute('data-copied','false');},2000);});})(this)">${COPY_SVG}${CHECK_SVG}</button>`;

    this.result = this.result.replace(
      /<pre([^>]*)class="([^"]*language-[^"]*)"([^>]*)>([\s\S]*?)<\/pre>/g,
      (_match, beforeAttrs, cls, afterAttrs, inner) =>
        `<div class="code-block-wrapper">${btn}<pre${beforeAttrs}class="${cls}"${afterAttrs}>${inner}</pre></div>`,
    );
    return this;
  }

  // return converted string
  process(): string {
    return this.result;
  }
}

export default HtmlConverter;
