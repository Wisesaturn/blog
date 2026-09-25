import { z } from 'zod';

import { notionMultiSelectNames, notionText, notionTitle } from '$shared/model/notionProperty';

/** 스니펫 데이터베이스에서 발행에 쓰는 속성. Notion 에서 속성 이름이나 타입을 바꾸면 여기도 바꾼다 */
export const snippetNotionProperties = z.object({
  이름: notionTitle,
  skills: notionMultiSelectNames,
  description: notionText,
});
