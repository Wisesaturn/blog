import getMarkdown from '$features/post/lib/getMarkdown';
import replaceBodyImages from '$features/post/api/firebase/replaceBodyImages';
import uploadImage from '$features/post/api/firebase/uploadImage';
import deleteStore from '$features/post/api/deleteStore';
import getHtml from '$features/post/lib/getHtml';
import { DEFAULT_THUMBNAIL } from '$features/post/constant';

import convertString from '$shared/lib/convertString';
import notion from '$shared/middleware/notion';
import Logger from '$shared/helper/logger';
import { INotionList, NotionPage } from '$shared/types/notion';

import { IProject } from '../types/project';

/**
 * @summary Notion에서 작성한 프로젝트를 마크다운으로 변환하여 게시물을 생성하는 함수
 * @param title
 * @returns
 */
export default async function createProject(title: string) {
  try {
    const project: IProject = await notion.databases
      .query({
        database_id: process.env.NOTION_DATABASE_PROJECTS_KEY,
      })
      .then(async (data: INotionList<'project'>) => {
        const selectedPost = data.results.filter(
          (result: NotionPage<'project'>) =>
            result.object === 'page' &&
            result.properties.이름.title[0].plain_text === convertString(title, 'dashToSpace'),
        );

        if (selectedPost.length === 0) {
          throw new Error(`${title}를 찾을 수 없습니다`);
        } else {
          Logger.log(`${selectedPost[0].id}/${title}를 찾았습니다`);
        }

        // post date format
        const createdTime = new Date(selectedPost[0].created_time);
        const lastEditedTime = new Date(selectedPost[0].last_edited_time);
        // ////////////////// data /////////////////// //
        const projectData: IProject = {
          index: selectedPost[0].id,
          title: `${selectedPost[0].icon?.emoji ? `${selectedPost[0].icon.emoji} ` : ''}${
            selectedPost[0].properties.이름.title[0].plain_text
          }`,
          plainTitle: selectedPost[0].properties.이름.title[0].plain_text,
          theme: selectedPost[0].properties.theme.rich_text[0].plain_text,
          thumbnail: selectedPost[0].cover?.external?.url || selectedPost[0].cover?.file?.url || '',
          category: selectedPost[0].properties.category.select.name,
          createdAt: new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium' }).format(createdTime),
          lastEditedAt: new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium' }).format(
            lastEditedTime,
          ),
          description: selectedPost[0].properties.description.rich_text[0].plain_text,
          skills: selectedPost[0].properties.skills.multi_select.map((skill) => skill.name),
          role: selectedPost[0].properties.role.multi_select.map((role) => role.name),
          github: selectedPost[0].properties.github.url,
          lastmod: new Intl.DateTimeFormat('fr-CA', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
          }).format(lastEditedTime),
          date: {
            start: selectedPost[0].properties.date.date.start,
            end: selectedPost[0].properties.date.date.end,
          },
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
        const mdString = await getMarkdown(selectedPost[0].id);

        // 3. get html tag
        const htmlBody = await getHtml(mdString);
        projectData.body = htmlBody;

        // 3. upload thumbnail on firsbase
        if (projectData.thumbnail) {
          const customThumbnail = await uploadImage({
            collection: 'project',
            src: projectData.thumbnail,
            category: `${projectData.category}-projects`,
            title: convertString(projectData.plainTitle, 'spaceToDash'),
          });

          projectData.thumbnail = customThumbnail;
        } else {
          projectData.thumbnail = DEFAULT_THUMBNAIL;
          Logger.log('기본 썸네일 설정');
        }

        // 4. upload image on firebase
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
      Logger.error(new Error(`${title} 프로젝트 생성에 실패하였습니다.`));
      Logger.error(err);
    }
    throw err;
  }
}
