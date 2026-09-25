import { type PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

/** `getNotionPage` 가 속성을 도메인 스키마로 검사하고 값으로 바꾼 뒤 돌려주는 페이지 */
export type NotionPage<P> = Omit<PageObjectResponse, 'properties'> & {
  properties: P;
};
