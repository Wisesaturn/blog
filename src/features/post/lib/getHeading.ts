import { Heading } from '$features/post/types/article';

/**
 * @summary body 태그 내에서 모든 Heading를 찾는 함수
 * @param body
 * @returns
 */
export default function getHeading(body: string): Heading[] {
  const headings: Heading[] = [];

  // 정규식 패턴을 사용하여 <h2>, <h3>, <h4> 태그와 ID를 추출
  const regex = /<h([2-4])\s*id=["']([^"']+)["'][^>]*>(.*?)<\/h\1>/gi;

  let match;

  // eslint-disable-next-line no-cond-assign
  while ((match = regex.exec(body)) !== null) {
    const level = parseInt(match[1], 10);
    const id = match[2];
    const text = match[3];

    const heading: Heading = {
      level,
      id,
      text,
    };

    headings.push(heading);
  }

  return headings;
}
