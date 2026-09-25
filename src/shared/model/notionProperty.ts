import { z } from 'zod';

/**
 * Notion 페이지 속성 하나를 검사하고 발행에 쓸 값으로 바꾸는 zod 스키마 모음이다.
 * 도메인별 스키마(`features/{domain}/model/notionProperties.ts`)가 이것들을 조합한다.
 *
 * 입력은 SDK 가 돌려준 속성 객체(`{ id, type, [type]: 값 }`)이고, 출력은 문자열이나 배열 같은 값이다.
 * 에러 메시지는 `getNotionPage` 가 속성 이름과 함께 모아서 보여준다.
 */

const EMPTY = '값이 비어 있습니다';

/** 속성이 아예 없을 때의 메시지를 정한다. 나머지는 zod 기본 메시지를 쓴다 */
const property = <T extends z.ZodRawShape>(shape: T) =>
  z.object(shape, {
    error: (issue) => (issue.input === undefined ? '속성이 없습니다' : undefined),
  });

/** Notion 에서 속성 타입을 바꾼 경우를 알아볼 수 있게 기대한 타입과 실제 타입을 함께 적는다 */
const type = <T extends string>(expected: T) =>
  z.literal(expected, {
    error: (issue) => `${expected} 가 아니라 ${String(issue.input)} 입니다`,
  });

const richText = z.array(z.object({ plain_text: z.string() }));

/**
 * 제목. 비어 있으면 에러다. 글 제목은 Firestore 문서 ID 가 되기 때문이다.
 *
 * 첫 조각만 쓰는 것은 예전 동작을 그대로 둔 것이다. 조각을 모두 이어 붙이면 이미 발행한 글의
 * 문서 ID 가 바뀌어 새 문서로 다시 만들어질 수 있다.
 */
export const notionTitle = property({ type: type('title'), title: richText })
  .transform((p) => p.title[0]?.plain_text ?? '')
  .pipe(z.string().min(1, EMPTY));

/** 텍스트. 비어 있으면 빈 문자열이다. 첫 조각만 쓰는 이유는 `notionTitle` 과 같다 */
export const notionText = property({ type: type('rich_text'), rich_text: richText }).transform(
  (p) => p.rich_text[0]?.plain_text ?? '',
);

/** 선택 항목의 이름. 비어 있으면 에러다. 글 카테고리는 Firestore 컬렉션 이름이 된다 */
export const notionSelectName = property({
  type: type('select'),
  select: z.object({ name: z.string().min(1, EMPTY) }, { error: EMPTY }),
}).transform((p) => p.select.name);

/** 다중 선택 항목의 이름 목록 */
export const notionMultiSelectNames = property({
  type: type('multi_select'),
  multi_select: z.array(z.object({ name: z.string() })),
}).transform((p) => p.multi_select.map((option) => option.name));

/** URL. 비어 있으면 null 이고, 그대로 null 로 저장한다 */
export const notionUrl = property({ type: type('url'), url: z.string().nullable() }).transform(
  (p) => p.url,
);

/** 기간. 비어 있으면 에러다. 끝 날짜는 진행 중이면 null 이다 */
export const notionDate = property({
  type: type('date'),
  date: z.object({ start: z.string(), end: z.string().nullable() }, { error: EMPTY }),
}).transform((p) => ({ start: p.date.start, end: p.date.end }));

/**
 * @description zod 검사 실패를 `속성: 이유` 목록 한 줄로 만든다
 * @param error 도메인 속성 스키마가 낸 에러
 * @returns 예: `tags: 속성이 없습니다, category.type: select 가 아니라 multi_select 입니다`
 */
export function formatNotionIssues(error: z.ZodError): string {
  return error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(', ');
}
