import { z } from 'zod';

import {
  notionDate,
  notionMultiSelectNames,
  notionSelectName,
  notionText,
  notionTitle,
  notionUrl,
} from '$shared/model/notionProperty';

/** 프로젝트 데이터베이스에서 발행에 쓰는 속성. Notion 에서 속성 이름이나 타입을 바꾸면 여기도 바꾼다 */
export const projectNotionProperties = z.object({
  이름: notionTitle,
  theme: notionText,
  category: notionSelectName,
  description: notionText,
  skills: notionMultiSelectNames,
  role: notionMultiSelectNames,
  github: notionUrl,
  website: notionUrl,
  date: notionDate,
});
