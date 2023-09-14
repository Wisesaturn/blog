/* eslint-disable consistent-return */
/* eslint-disable camelcase */
import isExpiredThumbnail from '@utils/lib/isExpiredThumbnail';

import fetchDB from './fetchDB';
import postDB from './postDB';
import fetchNotionPost from './fetchNotionPost';

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
          .map((post: any): Partial<INotionPostReturn> => {
            const category = post.properties.category.select.name;
            const last_editedAt = new Date(post.last_edited_time);
            const createdAt = new Date(post.created_time).toLocaleDateString('ko-KR');
            const plain_title = `${post.properties.이름.title[0].plain_text}`;
            const title = `${post.icon?.emoji ? `${post.icon.emoji} ` : ''} ${
              post.properties.이름.title[0].plain_text
            }`;
            const thumbnail = (post.cover?.external?.url || post.cover?.file?.url) ?? '';
            const tags = post.properties.tags.multi_select;
            const index = post.id;
            const description = post.properties.description.rich_text[0]?.plain_text ?? '';

            const postDataJSON = {
              last_editedAt,
              plain_title,
              title,
              thumbnail,
              createdAt,
              category,
              tags,
              index,
              description,
            };

            fetchDB(category, plain_title.replace(/\s+/g, '-'))
              .then((res) => {
                if (last_editedAt === res.last_editedAt && !isExpiredThumbnail(res.thumbnail))
                  return;

                fetchNotionPost(document, plain_title.replace(/\s+/g, '-')).then((notionRes) => {
                  postDB(category, plain_title.replace(/\s+/g, '-'), notionRes);
                });
              })
              .catch(() => {
                fetchNotionPost(document, plain_title.replace(/\s+/g, '-')).then((notionRes) => {
                  postDB(category, plain_title.replace(/\s+/g, '-'), notionRes);
                });
              });

            return postDataJSON;
          })
          .sort((a: IPost, b: IPost) => {
            return a.createdAt < b.createdAt ? 1 : -1;
          });

        return blogPagesMap;
      });

    return blogPages;
  } catch (err: any) {
    throw new Error('게시물 목록을 불러오는데 실패하였습니다.');
  }
}
