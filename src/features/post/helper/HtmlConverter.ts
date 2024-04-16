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

  // return converted string
  process(): string {
    return this.result;
  }
}

export default HtmlConverter;
