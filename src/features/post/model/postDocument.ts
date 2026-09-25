import { z } from 'zod';

/** Firestore `{category}/{제목}` 에 저장하는 글 문서. `createPost` 가 만들고 `updatePost` 가 쓴다 */
export const postDocument = z.object({
  index: z.string(),
  title: z.string(),
  plain_title: z.string(),
  category: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  thumbnail: z.string(),
  createdAt: z.string(),
  last_editedAt: z.string(),
  lastmod: z.string(),
  body: z.string(),
  views: z.number(),
});

/** 목록에서 읽는 글. 본문은 크기가 커서 목록에서 빼고 상세에서만 읽는다 */
export const postListItem = postDocument.omit({ body: true });
