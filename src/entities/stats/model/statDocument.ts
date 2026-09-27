import { z } from 'zod';

import { STAT_KINDS } from './stat';

/**
 * Firestore `stats/{kind}:{key}` 문서. 발행 뒤에도 바뀌는 숫자만 둔다 (#117).
 *
 * 콘텐츠 본문 문서와 떼어 둔 이유: 조회수만 읽어도 본문까지 딸려 오고, 목록 통계를 한 번에 읽으려면
 * 콘텐츠 문서를 본문째 전부 읽어야 했다. 발행할 때 본문을 덮어써도 숫자를 따로 지킬 필요가 없다.
 *
 * `views`, `likes` 는 처음 쓰기 전까지 없을 수 있어 0 으로 읽는다.
 */
export const statDocument = z.object({
  kind: z.enum(STAT_KINDS),
  /** 글은 `카테고리/제목`, 스니펫과 프로젝트는 제목 */
  key: z.string().min(1),
  views: z.number().default(0),
  likes: z.number().default(0),
  /** 댓글을 다는 Notion 페이지. 발행할 때 기록한다 */
  notionPageId: z.string().optional(),
});

export type StatDocument = z.infer<typeof statDocument>;
