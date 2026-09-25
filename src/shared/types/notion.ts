import { type PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { type NOTION_PROPERTY_SCHEMA } from '$shared/constant/notion';

type NotionPropertySchema = typeof NOTION_PROPERTY_SCHEMA;

/** SDK 가 돌려주는 페이지 속성 하나. 속성 타입마다 모양이 다른 유니온이다 */
export type NotionProperty = PageObjectResponse['properties'][string];

export type NotionPropertyType = NotionProperty['type'];

/** 발행 스키마가 있는 Notion 데이터베이스 */
export type NotionPageKind = keyof NotionPropertySchema;

/** 스키마에 적은 속성만, 적은 타입으로 좁힌 속성 묶음 */
export type NotionProperties<K extends NotionPageKind> = {
  -readonly [P in keyof NotionPropertySchema[K]]: Extract<
    NotionProperty,
    { type: NotionPropertySchema[K][P] }
  >;
};

/** `getNotionPage` 가 속성을 검사한 뒤 돌려주는 페이지 */
export type NotionPage<K extends NotionPageKind> = Omit<PageObjectResponse, 'properties'> & {
  properties: NotionProperties<K>;
};
