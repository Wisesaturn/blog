import convertString from '$shared/lib/convertString';
import notion from '$shared/middleware/notion';
import Logger from '$shared/helper/logger';
import { INotionList, NotionPage } from '$shared/types/notion';

import { IPost } from '../types/post';
import { DEFAULT_THUMBNAIL, URL_PREFIX } from '../constant';
import deleteStore from './deleteStore';
import replaceBodyImages from './firebase/replaceBodyImages';
import getMarkdown from '../lib/getMarkdown';
import getHtml from '../lib/getHtml';
import createImageOnUrl from '../lib/createImageOnUrl';

/**
 * @summary Notion에서 작성한 포스트를 마크다운으로 변환하여 게시물을 생성하는 함수
 * @param title
 * @returns
 */
export default async function createPost(title: string) {
  try {
    const post: IPost = await notion.databases
      .query({
        database_id: process.env.NOTION_DATABASE_POSTS_KEY,
      })
      .then(async (data: INotionList<'post'>) => {
        const selectedPost = data.results.filter(
          (page: NotionPage<'post'>) =>
            page.object === 'page' &&
            page.properties.이름.title[0].plain_text === convertString(title, 'dashToSpace'),
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
        const postData: IPost = {
          index: selectedPost[0].id,
          title: `${selectedPost[0].icon?.emoji ? `${selectedPost[0].icon.emoji} ` : ''}${
            selectedPost[0].properties.이름.title[0].plain_text
          }`,
          thumbnail: selectedPost[0].cover?.external?.url || selectedPost[0].cover?.file?.url || '',
          plain_title: selectedPost[0].properties.이름.title[0].plain_text,
          category: selectedPost[0].properties.category.select.name,
          description: selectedPost[0].properties.description.rich_text[0]?.plain_text || '',
          tags: selectedPost[0].properties.tags.multi_select.map((keyword) => keyword.name),
          createdAt: new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium' }).format(createdTime),
          last_editedAt: new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium' }).format(
            lastEditedTime,
          ),
          lastmod: new Intl.DateTimeFormat('fr-CA', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
          }).format(lastEditedTime),
          body: '',
          views: 0,
        };
        // ////////////////// data /////////////////// //

        // 1. delete previous storage
        await deleteStore({
          collection: 'post',
          category: postData.category,
          title: convertString(postData.plain_title, 'spaceToDash'),
        });

        // 2. get markdown
        const mdString = await getMarkdown(selectedPost[0].id);

        // 3. get html tag
        const htmlBody = await getHtml(mdString);
        postData.body = htmlBody;

        // 3. upload thumbnail on Public Folder (use Vercel CDN)
        if (postData.thumbnail) {
          const filePath = await createImageOnUrl({
            savePath: `thumbnail`,
            title: `${postData.plain_title.replaceAll(':', '-')}`,
            url: postData.thumbnail,
          });
          postData.thumbnail = filePath;
          Logger.log(`썸네일 : ${filePath}`);
        } else {
          postData.thumbnail = DEFAULT_THUMBNAIL;
          Logger.log('기본 썸네일 설정');
        }

        // 4. upload image on firebase
        if (postData.body) {
          const replaceBody = await replaceBodyImages({
            collection: 'post',
            body: postData.body,
            category: postData.category,
            title: convertString(postData.plain_title, 'spaceToDash'),
          });
          postData.body = replaceBody;
        }

        Logger.success(`${title} 게시물을 생성하였습니다.`);

        return postData;
      });

    return post;
  } catch (err) {
    if (err instanceof Error) {
      const ApplicationError = new Error(`${title} 게시물 생성에 실패하였습니다.`, { cause: err });
      Logger.error(ApplicationError);
      throw ApplicationError;
    }
    throw err;
  }
}
