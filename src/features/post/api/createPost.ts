import Logger from '$shared/helper/logger';
import convertString from '$shared/lib/convertString';
import getNotionPage from '$shared/api/getNotionPage';

import { DEFAULT_THUMBNAIL } from '../constant';
import getHtml from '../lib/getHtml';
import getMarkdown from '../lib/getMarkdown';
import { IPost } from '../types/post';
import deleteStore from './deleteStore';
import uploadImage from './firebase/uploadImage';
import replaceBodyImages from './firebase/replaceBodyImages';

/**
 * @summary Notion에서 작성한 포스트를 마크다운으로 변환하여 게시물을 생성하는 함수
 * @param pageId 발행할 Notion 페이지 ID. 웹훅 본문의 `data.id`
 * @returns
 */
export default async function createPost(pageId: string) {
  try {
    const post: IPost = await getNotionPage<'post'>(
      pageId,
      process.env.NOTION_DATABASE_POSTS_KEY,
    ).then(async (page) => {
      const title = page.properties.이름.title[0]?.plain_text ?? '';
      Logger.log(`${page.id}/${title}를 찾았습니다`);

      // post date format
      const createdTime = new Date(page.created_time);
      const lastEditedTime = new Date(page.last_edited_time);

      // ////////////////// data /////////////////// //
      const postData: IPost = {
        index: page.id,
        title: `${page.icon?.emoji ? `${page.icon.emoji} ` : ''}${
          page.properties.이름.title[0].plain_text
        }`,
        thumbnail: page.cover?.external?.url || page.cover?.file?.url || '',
        plain_title: page.properties.이름.title[0].plain_text,
        category: page.properties.category.select.name,
        description: page.properties.description.rich_text[0]?.plain_text || '',
        tags: page.properties.tags.multi_select.map((keyword) => keyword.name),
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
      const mdString = await getMarkdown(page.id);

      // 3. get html tag
      const htmlBody = await getHtml(mdString);
      postData.body = htmlBody;

      // 3. upload thumbnail on Firebase Storage
      // 본문 이미지와 같은 폴더에 올린다. 다시 발행할 때 위의 deleteStore 가 폴더를 비우므로
      // 옛 썸네일이 함께 지워진다. 배포 환경은 /tmp 말고는 디스크에 쓸 수 없어 로컬 public/ 에 두지 않는다
      if (postData.thumbnail) {
        const thumbnailUrl = await uploadImage({
          src: postData.thumbnail,
          collection: 'post',
          category: postData.category,
          title: convertString(postData.plain_title, 'spaceToDash'),
        });
        postData.thumbnail = thumbnailUrl;
        Logger.log(`썸네일 : ${thumbnailUrl}`);
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
      const ApplicationError = new Error(`${pageId} 게시물 생성에 실패하였습니다.`, { cause: err });
      Logger.error(ApplicationError);
      throw ApplicationError;
    }
    throw err;
  }
}
