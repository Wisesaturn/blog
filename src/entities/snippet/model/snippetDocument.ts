import { z } from 'zod';

/** Firestore `snippets/{제목}` 에 저장하는 스니펫 문서. `createSnippet` 이 만들고 `updateSnippet` 이 쓴다 */
export const snippetDocument = z.object({
  index: z.string(),
  title: z.string(),
  plainTitle: z.string(),
  description: z.string(),
  skills: z.array(z.string()),
  createdAt: z.string(),
  lastEditedAt: z.string(),
  lastmod: z.string(),
  body: z.string(),
  views: z.number(),
});
