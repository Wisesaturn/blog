import { type PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { NOTION_PROPERTY_SCHEMA } from '$shared/constant/notion';
import {
  type NotionPageKind,
  type NotionProperties,
  type NotionPropertyType,
} from '$shared/types/notion';

/**
 * @description Notion 페이지 속성이 발행 스키마(`NOTION_PROPERTY_SCHEMA`)와 맞는지 확인하고 좁힌 타입으로 돌려준다
 * @param properties SDK 가 돌려준 페이지 속성
 * @param kind 어느 데이터베이스의 스키마로 검사할지
 * @returns 스키마에 적은 속성을 적은 타입으로 좁힌 묶음
 * @throws 속성이 없거나 타입이 다르면, 어긋난 속성을 모두 적은 에러
 */
export default function pickNotionProperties<K extends NotionPageKind>(
  properties: PageObjectResponse['properties'],
  kind: K,
): NotionProperties<K> {
  const schema: Record<string, NotionPropertyType> = NOTION_PROPERTY_SCHEMA[kind];

  const problems = Object.entries(schema).flatMap(([name, type]) => {
    const property = properties[name];
    if (!property) return [`${name} 속성이 없습니다`];
    if (property.type !== type) return [`${name} 속성이 ${type} 가 아니라 ${property.type} 입니다`];
    return [];
  });

  if (problems.length > 0) {
    throw new Error(
      `Notion ${kind} 페이지의 속성이 발행 스키마와 다릅니다: ${problems.join(', ')}`,
    );
  }

  // 스키마의 속성 이름과 타입을 위에서 모두 확인했다. 컴파일러는 이 검사를 매핑 타입까지 따라가지 못한다
  return properties as NotionProperties<K>;
}
