import { IHeading } from '../model/types';

/**
 * @summary body 태그 내에서 모든 Heading를 찾는 함수
 * @param body
 * @returns
 */
export default function getHeading(body: string): IHeading[] {
  const headings: IHeading[] = [];

  // <h2> ~ <h5> 태그와 ID 를 추출한다. Notion 제목 1~4 가 한 단계씩 내려 h2~h5 가 된다.
  // 코드 제목(h5.code-title)은 마크다운 안의 원본 HTML 이라 id 가 없어 뽑히지 않는다
  const regex = /<h([2-5])\s*id=["']([^"']+)["'][^>]*>(.*?)<\/h\1>/gi;

  let match;

  while ((match = regex.exec(body)) !== null) {
    const level = parseInt(match[1], 10);
    const id = match[2];
    const text = match[3];

    const heading: IHeading = {
      level,
      id,
      text,
    };

    headings.push(heading);
  }

  return headings;
}
