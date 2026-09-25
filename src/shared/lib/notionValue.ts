import { type PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

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
