import { unified } from 'unified';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeHighlight from 'rehype-highlight';
import remarkMath from 'remark-math';
import rehypeMathjax from 'rehype-mathjax';

const { Client } = require('@notionhq/client');
const { NotionToMarkdown } = require('notion-to-md');

const notion = new Client({
  auth: process.env.NOTION_KEY,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

export default async function fetchNotionPost(document: string, title: string) {
  try {
    const blogPage = await notion.databases
      .query({
        database_id: process.env.NOTION_DATABASE_KEY,
      })
      .then(async (data: any) => {
        const selectedPost = data.results.filter((e: any) => {
          return (
            e.object === 'page' &&
            e.properties.이름.title[0].plain_text === title.replace(/-+/g, ' ')
          );
        });

        const mdblocks = await n2m.pageToMarkdown(selectedPost[0].id);
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
        return {
          plain_title: `${selectedPost[0].properties.이름.title[0].plain_text}`,
          title: `${selectedPost[0].icon?.emoji ? `${selectedPost[0].icon.emoji} ` : ''}${
            selectedPost[0].properties.이름.title[0].plain_text
          }`,
          thumbnail:
            (selectedPost[0].cover?.external?.url || selectedPost[0].cover?.file?.url) ?? '',
          createdAt: new Date(selectedPost[0].created_time).toLocaleDateString('ko-KR'),
          tags: selectedPost[0].properties.tags.multi_select,
          index: selectedPost[0].id,
          description: selectedPost[0].properties.description.rich_text[0]?.plain_text ?? '',
          last_editedAt: new Date(selectedPost[0].last_edited_time),
          body: result.value,
          category: selectedPost[0].properties.category.select.name,
        };
      });

    return blogPage;
  } catch (err: any) {
    throw new Error('게시물을 불러오는데 실패하였습니다.');
  }
}
