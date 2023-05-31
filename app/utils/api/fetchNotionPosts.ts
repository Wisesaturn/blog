import type { IPost, INotionPostReturn } from '@Types/post';

const { Client } = require('@notionhq/client');

const notion = new Client({
  auth: process.env.NOTION_KEY,
});

export default async function fetchNotionPosts(document: string) {
  try {
    const blogPages = await notion.databases
      .query({
        database_id: process.env.NOTION_DATABASE_KEY,
      })
      .then(async (data: any) => {
        const blogPageIdList = data.results.filter((e: any) => {
          return e.object === 'page' && e.properties.category.select.name === document;
        });

        if (blogPageIdList.length === 0)
          throw new Error(`"${document}" 카테고리가 존재하지 않습니다.`);

        const blogPagesMap = blogPageIdList
          .map((post: any): INotionPostReturn => {
            console.log(post.properties.description.rich_text);
            return {
              title: `${post.icon?.emoji ? `${post.icon.emoji} ` : ''}${
                post.properties.이름.title[0].plain_text
              }`,
              thumbnail: post.cover?.external.url ?? '',
              createdAt: new Date(post.created_time).toLocaleDateString('ko-KR'),
              tags: post.properties.tags.multi_select,
              index: post.id,
              description: post.properties.description.rich_text[0]?.plain_text ?? '',
            };
          })
          .sort((a: IPost, b: IPost) => {
            return a.createdAt < b.createdAt ? 1 : -1;
          });

        return blogPagesMap;
      });

    return blogPages;
  } catch (err: any) {
    if (err.message === '') throw new Error('게시물 목록을 불러오는데 실패하였습니다.');
    throw new Error(err.message);
  }
}
