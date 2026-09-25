import { z } from 'zod';

/** 본문에서 쓰는 부분만 검사한다. `source` 와 페이지 속성은 보지 않는다 */
const notionPageWebhookBody = z.object({
  data: z.object({ object: z.literal('page'), id: z.string().min(1) }),
});

/**
 * @description Notion "웹훅 보내기" 본문에서 버튼을 누른 페이지의 ID 를 꺼낸다
 * @param body 발행 API 로 들어온 JSON 본문
 * @returns Notion 페이지 ID
 * @throws 본문이 Notion 페이지 웹훅 형식이 아니면 에러
 *
 * Notion 은 본문을 정할 수 없고 `{ source, data }` 형식으로 보낸다. `data` 는 누른 페이지 자체라
 * `data.object` 가 `'page'` 이고 `data.id` 에 페이지 ID 가 있다.
 * @example
 * getWebhookPageId({ source: { type: 'automation' }, data: { object: 'page', id: 'a31f4f15-...' } });
 * // 'a31f4f15-...'
 */
export default function getWebhookPageId(body: unknown): string {
  const result = notionPageWebhookBody.safeParse(body);
  if (!result.success) {
    throw new Error('Notion 페이지 웹훅 본문이 아닙니다', { cause: result.error });
  }
  return result.data.data.id;
}
