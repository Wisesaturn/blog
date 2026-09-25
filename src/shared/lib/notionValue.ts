import {
  type PageObjectResponse,
  type RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints';

/**
 * @description 리치 텍스트의 첫 조각을 글자로 꺼낸다
 * @param richText title 이나 rich_text 속성의 값
 * @returns 첫 조각의 글자. 비어 있으면 undefined
 *
 * 첫 조각만 쓰는 것은 예전 동작을 그대로 둔 것이다. 글 제목은 Firestore 문서 ID 가 되므로
 * 조각을 모두 이어 붙이면 이미 발행한 글이 다른 문서로 다시 만들어질 수 있다.
 */
export function getFirstPlainText(richText: RichTextItemResponse[]): string | undefined {
  return richText[0]?.plain_text;
}

/**
 * @description 발행에 꼭 필요한 값이 비어 있으면 에러를 낸다
 * @param value 확인할 값
 * @param label 에러에 적을 속성 이름
 * @returns 비어 있지 않은 값
 * @throws null, undefined, 빈 문자열이면 에러
 * @example
 * const category = requireNotionValue(properties.category.select?.name, 'category');
 */
export function requireNotionValue<T>(value: T | null | undefined, label: string): T {
  if (value === null || value === undefined || value === '') {
    throw new Error(`Notion 페이지의 ${label} 값이 비어 있습니다`);
  }
  return value;
}

/**
 * @description 페이지 아이콘이 이모지면 그 이모지를 돌려준다
 * @param icon 페이지의 `icon`
 * @returns 이모지. 아이콘이 없거나 이미지 아이콘이면 undefined
 */
export function getIconEmoji(icon: PageObjectResponse['icon']): string | undefined {
  return icon?.type === 'emoji' ? icon.emoji : undefined;
}

/**
 * @description 페이지 커버 이미지의 주소를 돌려준다
 * @param cover 페이지의 `cover`
 * @returns 외부 링크나 Notion 에 올린 파일의 주소. 커버가 없으면 빈 문자열
 */
export function getCoverUrl(cover: PageObjectResponse['cover']): string {
  if (cover?.type === 'external') return cover.external.url;
  if (cover?.type === 'file') return cover.file.url;
  return '';
}
