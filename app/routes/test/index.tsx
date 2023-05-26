import { useLoaderData } from '@remix-run/react';
import { unified } from 'unified';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

import type { LoaderArgs } from '@remix-run/node';

const { Client } = require('@notionhq/client');
const { NotionToMarkdown } = require('notion-to-md');

const notion = new Client({
  auth: process.env.NOTION_KEY,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

export async function loader() {
  const blogPage = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_KEY,
  });

  const blogPageIdList = blogPage.results
    .filter((e: any) => {
      return e.object === 'page';
    })
    .map((e: any) => {
      return e.id;
    });

  const mdblocks = await n2m.pageToMarkdown(blogPageIdList[0]);
  const mdString = n2m.toMarkdownString(mdblocks);

  const result = await unified()
    .use(remarkParse) // markdown을 mdast로 변환
    .use(remarkGfm) // remark가 GFM도 지원 가능하도록
    .use(remarkBreaks) // remark가 line-break도 지원 가능하도록
    .use(remarkRehype, { allowDangerousHtml: true }) // mdast를 hast로 변환
    .use(rehypeStringify, { allowDangerousHtml: true }) // hast를 html 변환
    .process(mdString.parent);
  return result;
}

const Testing = () => {
  const load = useLoaderData();

  console.log(load);

  return <>{load}</>;
};

export default Testing;
