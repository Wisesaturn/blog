import { isFullPage } from '@notionhq/client';
import { type z } from 'zod';

import { formatNotionIssues } from '@/shared/model/notionProperty';
import { type NotionPage } from '@/shared/types/notion';

import notion from '@/commons/api/notion.server';

const normalizeId = (id: string) => id.replace(/-/g, '').toLowerCase();

/**
 * @description 발행할 Notion 페이지를 ID 로 가져오고, 기대한 데이터베이스의 페이지인지 확인한다
 * @param pageId 웹훅 본문에서 꺼낸 페이지 ID
 * @param databaseId 이 발행 API 가 다루는 데이터베이스 ID (`NOTION_DATABASE_*_KEY`)
 * @param schema 도메인 속성 스키마 (`features/{domain}/model/notionProperties.ts`)
 * @returns 속성을 스키마로 검사하고 값으로 바꾼 페이지
 * @throws 데이터베이스 ID 가 없거나, 휴지통에 있거나, 다른 데이터베이스의 페이지거나, 속성이 스키마와 다르면 에러
 *
 * 예전에는 데이터베이스 전체를 받아 제목이 같은 페이지를 골랐다. 제목이 빈 페이지나 같은 제목이 있으면
 * 엉뚱한 페이지를 고를 수 있었고, 발행과 무관한 페이지 하나가 모든 발행을 막기도 했다.
 *
 * 부모 데이터베이스를 확인하는 이유는 글 버튼이 스니펫 API 를 부르는 식의 잘못된 설정을 막기 위해서다.
 * 확인하지 않으면 다른 데이터베이스의 속성을 읽다가 중간에 실패하거나, 이름이 같은 속성이 있으면
 * 엉뚱한 컬렉션에 저장된다. Notion 은 ID 를 하이픈이 있거나 없는 두 형태로 쓰므로 하이픈을 빼고 비교한다.
 */
export default async function getNotionPage<S extends z.ZodType>(
  pageId: string,
  databaseId: string | undefined,
  schema: S,
): Promise<NotionPage<z.output<S>>> {
  if (!databaseId) throw new Error('발행 대상 데이터베이스 ID 가 없습니다');

  const page = await notion.pages.retrieve({ page_id: pageId });
  if (!isFullPage(page)) throw new Error(`${pageId} 페이지의 속성을 읽을 수 없습니다`);
  if ('in_trash' in page && page.in_trash)
    throw new Error(`${pageId} 는 휴지통에 있는 페이지입니다`);

  const parentDatabaseId = 'database_id' in page.parent ? page.parent.database_id : undefined;
  if (!parentDatabaseId || normalizeId(parentDatabaseId) !== normalizeId(databaseId)) {
    throw new Error(`${pageId} 는 이 발행 대상 데이터베이스의 페이지가 아닙니다`);
  }

  const properties = schema.safeParse(page.properties);
  if (!properties.success) {
    throw new Error(
      `${pageId} 페이지의 속성이 발행 스키마와 다릅니다: ${formatNotionIssues(properties.error)}`,
    );
  }

  return { ...page, properties: properties.data };
}
