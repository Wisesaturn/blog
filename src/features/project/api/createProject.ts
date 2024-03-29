import getMarkdown from '$features/post/lib/getMarkdown';
import replaceBodyImages from '$features/post/api/firebase/replaceBodyImages';
import uploadImage from '$features/post/api/firebase/uploadImage';
import deleteStore from '$features/post/api/deleteStore';
import getHtml from '$features/post/lib/getHtml';

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
    const post: IProject = await notion.databases
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
        const postData: IProject = {
          plainTitle: '',
        };
        // ////////////////// data /////////////////// //

        // 1. delete previous storage
        await deleteStore({
          collection: 'project',
          category: postData.category,
          title: convertString(postData.plainTitle, 'spaceToDash'),
        });

        // 2. get markdown
        const mdString = await getMarkdown(selectedPost[0].id);

        // 3. get html tag
        const htmlBody = await getHtml(mdString);
        postData.body = htmlBody;

        // 3. upload thumbnail on firsbase
        if (selectedPost[0].cover?.external?.url || selectedPost[0].cover?.file?.url) {
          const customThumbnail = await uploadImage({
            collection: 'project',
            src: selectedPost[0].cover.external?.url || selectedPost[0].cover.file?.url || '',
            category: postData.category,
            title: convertString(postData.plainTitle, 'spaceToDash'),
          });

          postData.thumbnail = customThumbnail;
        } else {
          Logger.log('기본 썸네일 설정');
        }

        // 4. upload image on firebase
        if (postData.body) {
          const replaceBody = await replaceBodyImages({
            collection: 'project',
            body: postData.body,
            category: postData.category,
            title: convertString(postData.plainTitle, 'spaceToDash'),
          });
          postData.body = replaceBody;
        }

        Logger.success(`${title} 게시물을 생성하였습니다.`);

        return postData;
      });

    return post;
  } catch (err) {
    if (err instanceof Error) {
      Logger.error(new Error(`${title} 게시물 생성에 실패하였습니다.`));
      Logger.error(err);
    }
    throw err;
  }
}
