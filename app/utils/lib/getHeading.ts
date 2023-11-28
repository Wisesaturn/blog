/* eslint-disable no-cond-assign */
import { Heading } from '@components/TOC';

export default function getHeading(body: string): Heading[] {
  const headings: Heading[] = [];

  // 정규식 패턴을 사용하여 <h1>, <h2>, <h3> 태그와 ID를 추출
  const regex = /<h([1-2])\s*id=["']([^"']+)["'][^>]*>(.*?)<\/h\1>/gi;
  let match;

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
