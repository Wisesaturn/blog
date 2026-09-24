import getMarkdown from '$features/post/lib/getMarkdown';
import replaceBodyImages from '$features/post/api/firebase/replaceBodyImages';
import deleteStore from '$features/post/api/deleteStore';
import getHtml from '$features/post/lib/getHtml';

import convertString from '$shared/lib/convertString';
import getNotionPage from '$shared/api/getNotionPage';
import Logger from '$shared/helper/logger';

import { ISnippet } from '../types/snippet';

/**
 * @summary Notion에서 작성한 스니펫을 마크다운으로 변환하여 게시물을 생성하는 함수
 * @param pageId 발행할 Notion 페이지 ID. 웹훅 본문의 `data.id`
 * @returns
 */
export default async function createSnippet(pageId: string) {
  try {
    const snippet: ISnippet = await getNotionPage<'snippet'>(
      pageId,
      process.env.NOTION_DATABASE_SNIPPETS_KEY,
    ).then(async (page) => {
      const title = page.properties.이름.title[0]?.plain_text ?? '';
      Logger.log(`${page.id}/${title}를 찾았습니다`);

      // post date format
      const createdTime = new Date(page.created_time);
      const lastEditedTime = new Date(page.last_edited_time);
      // ////////////////// data /////////////////// //
      const snippetData: ISnippet = {
        index: page.id,
        title: `${page.icon?.emoji ? `${page.icon.emoji} ` : ''}${
          page.properties.이름.title[0].plain_text
        }`,
        plainTitle: page.properties.이름.title[0].plain_text,
        createdAt: new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium' }).format(createdTime),
        lastEditedAt: new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium' }).format(
          lastEditedTime,
        ),
        description: page.properties.description.rich_text[0].plain_text,
        skills: page.properties.skills.multi_select.map((skill) => skill.name),
        lastmod: new Intl.DateTimeFormat('fr-CA', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
        }).format(lastEditedTime),
        views: 0,
        body: '',
      };
      // ////////////////// data /////////////////// //

      // 1. delete previous storage
      await deleteStore({
        collection: 'snippet',
        category: `snippets`,
        title: convertString(snippetData.plainTitle, 'spaceToDash'),
      });

      // 2. get markdown
      const mdString = await getMarkdown(page.id);

      // 3. get html tag
      const htmlBody = await getHtml(mdString);
      snippetData.body = htmlBody;

      // 4. upload image on firebase
      if (snippetData.body) {
        const replaceBody = await replaceBodyImages({
          collection: 'snippet',
          body: snippetData.body,
          category: `snippets`,
          title: convertString(snippetData.plainTitle, 'spaceToDash'),
        });
        snippetData.body = replaceBody;
      }

      Logger.success(`${title} 스니펫을 생성하였습니다.`);

      return snippetData;
    });

    return snippet;
  } catch (err) {
    if (err instanceof Error) {
      const ApplicationError = new Error(`${pageId} 스니펫 생성에 실패하였습니다.`, { cause: err });
      Logger.error(ApplicationError);
      throw ApplicationError;
    }
    throw err;
  }
}
