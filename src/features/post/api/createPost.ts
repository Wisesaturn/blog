/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */

import { unified } from 'unified';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkMath from 'remark-math';
import rehypePrism from 'rehype-prism-plus';
import rehypeMathjax from 'rehype-mathjax';
import rehypeSlug from 'rehype-slug';
import chalk from 'chalk';

import convertString from '$shared/lib/convertString';
import notion from '$shared/middleware/notion';

import { IPost } from '../types/post';
import { DEFAULT_THUMBNAIL } from '../constant';
import deleteStore from './deleteStore';
import uploadImage from './firebase/uploadImage';
import replaceBodyImages from './firebase/replaceBodyImages';
import getMarkdown from '../lib/getMarkdown';
import { INotionTag } from '../types/article';

/**
 * @summary Notion에서 작성한 포스트를 마크다운으로 변환하여 게시물을 생성하는 함수
 * @param title
 * @returns
 */
export default async function createPost(title: string) {
  try {
    const post: IPost = await notion.databases
      .query({
        database_id: process.env.NOTION_DATABASE_KEY,
      })
      .then(async (data: any) => {
        const selectedPost = data.results.filter(
          (e: any) =>
            e.object === 'page' &&
            e.properties.이름.title[0].plain_text === convertString(title, 'dashToSpace'),
        );

        if (selectedPost.length === 0) {
          console.log(chalk.red(`[ERROR] ${title}를 찾을 수 없습니다`));
          throw new Error(`${title}를 찾을 수 없습니다`);
        }

        const mdString = await getMarkdown(selectedPost[0].id);
        console.log(mdString);

        const result = await unified()
          .use(remarkParse) // markdown을 mdast로 변환
          .use(remarkGfm) // remark가 GFM도 지원 가능하도록
          .use(remarkBreaks) // remark가 line-break도 지원 가능하도록 (마크다운 문법 줄바꿈이 아닌 자연스럽게)
          .use(remarkMath) // math 기호 구분
          .use(remarkRehype, { allowDangerousHtml: true }) // mdast를 hast로 변환
          .use(rehypeSlug) // Header에 Id 값 붙이기
          .use(rehypeStringify, { allowDangerousHtml: true }) // hast를 html 변환
          .use(rehypeMathjax) // math 구문 강조용
          .use(rehypePrism) // code 강조용 (Highlight에서 Prism으로 교체)
          .process(mdString);

        const value = result.value as string;
        const createdTime = new Date(selectedPost[0].created_time);
        const lastEditedTime = new Date(selectedPost[0].last_edited_time);

        // ////////////////// data /////////////////// //
        const postData: IPost = {
          plain_title: selectedPost[0].properties.이름.title[0].plain_text,
          title: `${selectedPost[0].icon?.emoji ? `${selectedPost[0].icon.emoji} ` : ''}${
            selectedPost[0].properties.이름.title[0].plain_text
          }`,
          category: selectedPost[0].properties.category.select.name,
          body: value,
          description: selectedPost[0].properties.description.rich_text[0]?.plain_text || '',
          index: selectedPost[0].id,
          createdAt: new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium' }).format(createdTime),
          last_editedAt: new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium' }).format(
            lastEditedTime,
          ),
          lastmod: new Intl.DateTimeFormat('fr-CA', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
          }).format(lastEditedTime),
          thumbnail: DEFAULT_THUMBNAIL,
          views: 0,
          tags: selectedPost[0].properties.tags.multi_select.map(
            (keyword: INotionTag) => keyword.name,
          ),
        };
        // ////////////////// data /////////////////// //

        // delete previous storage
        await deleteStore(postData.category, convertString(postData.plain_title, 'spaceToDash'));

        // upload thumbnail on firsbase
        if (selectedPost[0].cover?.external?.url || selectedPost[0].cover?.file?.url) {
          const customThumbnail = await uploadImage({
            src: selectedPost[0].cover?.external?.url || selectedPost[0].cover?.file?.url,
            category: postData.category,
            title: convertString(postData.plain_title, 'spaceToDash'),
          });

          postData.thumbnail = customThumbnail;
        } else {
          console.log(chalk.gray(`[INFO] 기본 썸네일 설정`));
        }

        // upload image on firebase
        if (value) {
          const replaceBody = await replaceBodyImages({
            body: value,
            category: postData.category,
            title: convertString(postData.plain_title, 'spaceToDash'),
          });
          postData.body = replaceBody;
        }

        console.log(chalk.green(`[SCCCESS] ${title} 게시물을 생성하였습니다.`));

        return postData;
      });

    return post;
  } catch (err) {
    console.log(chalk.red(`[ERROR] ${title} 게시물 생성에 실패했습니다`));
    console.log(chalk.red(`[ERROR]`, err));
    throw err;
  }
}
