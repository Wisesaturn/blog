import { useLoaderData } from '@remix-run/react';
import { unified } from 'unified';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeHighlight from 'rehype-highlight';
import remarkMath from 'remark-math';
import styles from 'highlight.js/styles/github-dark-dimmed.css';
import rehypeMathjax from 'rehype-mathjax';

import type { LinksFunction } from '@remix-run/node';

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
    .use(remarkMath) // math 기호 구분
    .use(remarkRehype, { allowDangerousHtml: true }) // mdast를 hast로 변환
    .use(rehypeStringify, { allowDangerousHtml: true }) // hast를 html 변환
    .use(rehypeMathjax) // math 구문 강조용
    .use(rehypeHighlight) // code 강조용
    .process(mdString.parent);
  return result.value;
}

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: styles,
    },
  ];
};

export default function ReviewPage() {
  const post = useLoaderData();

  return (
    <>
      <div className="w-[4rem] rounded-full h-1 mx-auto bg-green-800 my-10" />
      <div className="markdown-body pb-10" dangerouslySetInnerHTML={{ __html: post }} />
    </>
  );
}
