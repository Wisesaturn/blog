import { IProject } from '@/entities/project';

import { DEFAULT_THUMBNAIL } from '@/commons/config/site';
import Logger from '@/commons/lib/logger';
import convertString from '@/commons/lib/convertString';

import getNotionPage from './getNotionPage';
import { getCoverUrl, getIconEmoji } from '../lib/notionValue';
import getMarkdown from '../lib/getMarkdown';
import replaceBodyImages from './replaceBodyImages';
import uploadImage from './uploadImage';
import deleteStore from './deleteStore';
import getHtml from '../lib/getHtml';
import { projectNotionProperties } from '../model/projectNotionProperties';

/**
 * @summary Notion에서 작성한 프로젝트를 마크다운으로 변환하여 게시물을 생성하는 함수
 * @param pageId 발행할 Notion 페이지 ID. 웹훅 본문의 `data.id`
 * @returns
 */
export default async function createProject(pageId: string) {
  try {
    const project: IProject = await getNotionPage(
      pageId,
      process.env.NOTION_DATABASE_PROJECTS_KEY,
      projectNotionProperties,
    ).then(async (page) => {
      const {
        이름: title,
        theme,
        category,
        description,
        skills,
        role,
        github,
        website,
        date,
      } = page.properties;
      Logger.log(`${page.id}/${title}를 찾았습니다`);
      const emoji = getIconEmoji(page.icon);

      // post date format
      const createdTime = new Date(page.created_time);
      const lastEditedTime = new Date(page.last_edited_time);
      // ////////////////// data /////////////////// //
      const projectData: IProject = {
        index: page.id,
        title: emoji ? `${emoji} ${title}` : title,
        plainTitle: title,
        theme,
        thumbnail: getCoverUrl(page.cover),
        category,
        createdAt: new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium' }).format(createdTime),
        lastEditedAt: new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium' }).format(
          lastEditedTime,
        ),
        description,
        skills,
        role,
        github,
        website,
        lastmod: new Intl.DateTimeFormat('fr-CA', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
        }).format(lastEditedTime),
        date,
        views: 0,
        body: '',
      };
      // ////////////////// data /////////////////// //

      // 1. delete previous storage
      await deleteStore({
        collection: 'project',
        category: `${projectData.category}-projects`,
        title: convertString(projectData.plainTitle, 'spaceToDash'),
      });

      // 2. get markdown
      const mdString = await getMarkdown(page.id);

      // 3. get html tag
      const htmlBody = await getHtml(mdString);
      projectData.body = htmlBody;

      // 4. upload thumbnail on Firebase Storage
      // 본문 이미지와 같은 폴더에 올려 다시 발행할 때 deleteStore 가 함께 정리하게 한다
      if (projectData.thumbnail) {
        const thumbnailUrl = await uploadImage({
          src: projectData.thumbnail,
          collection: 'project',
          category: `${projectData.category}-projects`,
          title: convertString(projectData.plainTitle, 'spaceToDash'),
        });
        projectData.thumbnail = thumbnailUrl;
        Logger.log(`썸네일 : ${thumbnailUrl}`);
      } else {
        projectData.thumbnail = DEFAULT_THUMBNAIL;
        Logger.log('기본 썸네일 설정');
      }

      // 5. upload image on firebase
      if (projectData.body) {
        const replaceBody = await replaceBodyImages({
          collection: 'project',
          body: projectData.body,
          category: `${projectData.category}-projects`,
          title: convertString(projectData.plainTitle, 'spaceToDash'),
        });
        projectData.body = replaceBody;
      }

      Logger.success(`${title} 프로젝트를 생성하였습니다.`);

      return projectData;
    });

    return project;
  } catch (err) {
    if (err instanceof Error) {
      const ApplicationError = new Error(`${pageId} 프로젝트 생성에 실패하였습니다.`, {
        cause: err,
      });
      Logger.error(ApplicationError);
      throw ApplicationError;
    }
    throw err;
  }
}
