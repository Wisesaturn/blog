// 목록과 상세 화면이 부르므로 클라이언트 번들에 들어간다. 그래서 가벼운 zod/mini 를 쓴다
import * as z from 'zod/mini';

/** 통계를 두는 콘텐츠 종류. 조회수 쿠키 이름과 API 경로에도 쓴다 */
export const STAT_KINDS = ['post', 'snippet', 'project'] as const;

/** 콘텐츠 종류. API 경로의 `:kind` 를 이 스키마로 검사한다 */
export const statKind = z.enum(STAT_KINDS);

export type StatKind = z.infer<typeof statKind>;

/** 콘텐츠 하나의 숫자. `GET /api/stats/:kind/:key` 응답이다 */
export const statValues = z.object({
  views: z.number(),
  likes: z.number(),
});

export type StatValues = z.infer<typeof statValues>;

/** `GET /api/stats/:kind` 응답. 키는 콘텐츠 키(글은 `카테고리/제목`, 스니펫과 프로젝트는 제목) */
export const statMap = z.record(z.string(), statValues);

export type StatMap = z.infer<typeof statMap>;

/** `POST /api/stats/:kind/:key/view` 응답. 올린 뒤의 조회수다 */
export const viewResult = z.object({ views: z.number() });
