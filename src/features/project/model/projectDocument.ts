import { z } from 'zod';

/**
 * 프로젝트 문서. Firestore 에는 `projects/{이름}/meta` 와 `projects/{이름}/body` 로 나눠 저장한다.
 * `createProject` 가 만들고 `updateProject` 가 나눠 쓴다.
 */
export const projectDocument = z.object({
  index: z.string(),
  title: z.string(),
  plainTitle: z.string(),
  theme: z.string(),
  description: z.string(),
  category: z.string(),
  skills: z.array(z.string()),
  role: z.array(z.string()),
  thumbnail: z.string(),
  // 진행 중인 프로젝트는 Notion 에서 끝 날짜가 비어 있어 null 로 저장된다
  date: z.object({ start: z.string(), end: z.string().nullable() }),
  // 예전 프로젝트 문서에는 website 필드 자체가 없는 것도 있다
  github: z.string().nullish(),
  website: z.string().nullish(),
  createdAt: z.string(),
  lastEditedAt: z.string(),
  lastmod: z.string(),
  body: z.string(),
  views: z.number(),
});

/** `projects/{이름}/meta` 문서 */
export const projectMeta = projectDocument.omit({ body: true });

/** `projects/{이름}/body` 문서 */
export const projectBody = projectDocument.pick({ body: true });
