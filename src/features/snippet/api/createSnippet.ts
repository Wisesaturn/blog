import getMarkdown from '$features/post/lib/getMarkdown';
import replaceBodyImages from '$features/post/api/firebase/replaceBodyImages';
import deleteStore from '$features/post/api/deleteStore';
import getHtml from '$features/post/lib/getHtml';

import convertString from '$shared/lib/convertString';
import notion from '$shared/middleware/notion';
import Logger from '$shared/helper/logger';
import { INotionList, NotionPage } from '$shared/types/notion';

import { ISnippet } from '../types/snippet';

/**
 * @summary Notion에서 작성한 스니펫을 마크다운으로 변환하여 게시물을 생성하는 함수
 * @param title
 * @returns
 */
export default async function createSnippet(title: string) {
  try {
    const snippet: ISnippet = await notion.databases
      .query({
        database_id: process.env.NOTION_DATABASE_SNIPPETS_KEY,
      })
      .then(async (data: INotionList<'snippet'>) => {
        const selectedPost = data.results.filter(
          (result: NotionPage<'snippet'>) =>
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
        const snippetData: ISnippet = {
          index: selectedPost[0].id,
          title: `${selectedPost[0].icon?.emoji ? `${selectedPost[0].icon.emoji} ` : ''}${
            selectedPost[0].properties.이름.title[0].plain_text
          }`,
          plainTitle: selectedPost[0].properties.이름.title[0].plain_text,
          createdAt: new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium' }).format(createdTime),
          lastEditedAt: new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium' }).format(
            lastEditedTime,
          ),
          description: selectedPost[0].properties.description.rich_text[0].plain_text,
          skills: selectedPost[0].properties.skills.multi_select.map((skill) => skill.name),
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
        const mdString = await getMarkdown(selectedPost[0].id);

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
      const ApplicationError = new Error(`${title} 스니펫 생성에 실패하였습니다.`, { cause: err });
      Logger.error(ApplicationError);
      throw ApplicationError;
    }
    throw err;
  }
}
