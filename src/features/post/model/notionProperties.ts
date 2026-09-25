import { z } from 'zod';

import {
  notionMultiSelectNames,
  notionSelectName,
  notionText,
  notionTitle,
} from '$shared/model/notionProperty';

/** 글 데이터베이스에서 발행에 쓰는 속성. Notion 에서 속성 이름이나 타입을 바꾸면 여기도 바꾼다 */
export const postNotionProperties = z.object({
  이름: notionTitle,
  category: notionSelectName,
  tags: notionMultiSelectNames,
  description: notionText,
});
