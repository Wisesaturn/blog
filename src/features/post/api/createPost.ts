/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import path from 'path';
import { createRequire } from 'module';

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

import { IPost } from '../types/post';
import { DEFAULT_THUMBNAIL } from '../constant';
import deleteStore from './deleteStore';
import uploadImage from './firebase/uploadImage';
import replaceBodyImages from './firebase/replaceBodyImages';
import replaceBodyHeadings from '../lib/replaceBodyHeadings';

const require = createRequire(import.meta.url);
const { Client } = createRequire(import.meta.url)(
  path.join(process.cwd(), 'node_modules/@notionhq/client'),
);
const { NotionToMarkdown } = createRequire(import.meta.url)(
  path.join(process.cwd(), 'node_modules/notion-to-md'),
);

// const { Client } = require('@notionhq/client');
// const { NotionToMarkdown } = require('notion-to-md');

const notion = new Client({
  auth: process.env.NOTION_KEY,
});

const n2m = new NotionToMarkdown({ notionClient: notion, convertImagesToBase64: true });

// ---------- embed settings (codepen)
n2m.setCustomTransformer('embed', async (block: any) => {
  const { embed } = block;
  if (!embed?.url) return '';
  if (embed.url.includes('codepen')) {
    const dataSlug = embed.url.split('/')[5].split('?')[0];
    return `<p class="codepen" data-height="300" data-default-tab="js,result" data-slug-hash=${dataSlug} data-user="Wisesaturn"
    style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
    </p>`;
  }

  return '';
});

// ---------- image settings
n2m.setCustomTransformer('image', async (block: any) => {
  const { image } = block;
  const caption =
    image.caption
      .map((cap: any) => {
        if (cap.href !== null) {
          return `<a href=${cap.href}>${cap.plain_text}</a>`;
        }

        return `${cap.plain_text}`;
      })
      .join('') || '';
  const plainCaption = image.caption
    .map((cap: any) => cap.plain_text)
    .join('')
    .replace(/&nbsp;/g, ' ');

  if (image.type === 'external') {
    const { url } = image.external;
    const alt = plainCaption || 'image';
    const plainAlt = alt.replace(/&nbsp;/g, ' ');
    return `<img loading="lazy" width="500" height="500" src="${url}" alt="${plainAlt}" />
  <div class="image-caption">${caption}</div>`;
  }

  const { url = '' } = image.file;
  const alt = plainCaption || decodeURIComponent(path.basename(url)).split('?').shift();
  const plainAlt = alt.replace(/&nbsp;/g, ' ');

  return `<img loading="lazy" width="500" height="500" src="${url}" alt="${plainAlt}" />
  <div class="image-caption">${caption}</div>`;
});

/**
 * @summary Notion에서 작성한 포스트를 'notion-to-md'를 활용하여 markdown 문법으로 변환하는 함수
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

        const mdblocks = await n2m.pageToMarkdown(selectedPost[0].id);
        const mdString = n2m.toMarkdownString(mdblocks);

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
          .process(mdString.parent);

        // replace heading
        const value = replaceBodyHeadings(result.value as string);

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
          tags: selectedPost[0].properties.tags.multi_select,
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
    throw err;
  }
}
