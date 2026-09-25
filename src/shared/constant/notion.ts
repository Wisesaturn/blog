/**
 * 발행 API 가 읽는 Notion 데이터베이스 속성의 이름과 타입이다.
 *
 * Notion 에서 속성 이름이나 타입을 바꾸면 여기도 함께 바꿔야 한다. 어긋나면 `getNotionPage` 가
 * 어떤 속성이 다른지 적은 에러를 내고 발행을 멈춘다. 페이지 자체의 `created_time`, `last_edited_time`,
 * `icon`, `cover` 는 속성이 아니라서 여기에 없다.
 */
export const NOTION_PROPERTY_SCHEMA = {
  post: {
    이름: 'title',
    category: 'select',
    tags: 'multi_select',
    description: 'rich_text',
  },
  snippet: {
    이름: 'title',
    skills: 'multi_select',
    description: 'rich_text',
  },
  project: {
    이름: 'title',
    theme: 'rich_text',
    category: 'select',
    description: 'rich_text',
    skills: 'multi_select',
    role: 'multi_select',
    github: 'url',
    website: 'url',
    date: 'date',
  },
} as const;
