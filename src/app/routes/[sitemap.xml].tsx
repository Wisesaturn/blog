/* eslint-disable import/prefer-default-export */
// 새로 카테고리 수정할시 'utils/constant/category.ts' 에서 Category 추가
// import { IFirebasePostReturn } from '@Types/post';
// import searchAllDB from '@utils/api/searchAllDB.server';
// import { PRODUCTION_CATEGORY_DATA } from '@utils/constant/category';

import { ISitemap } from '$shared/types/global';

const HOST_URL = `https://jaehan.blog`;

export const loader = async () => {
  // const getAllPost: IFirebasePostReturn[] = await searchAllDB();
  // handle "GET" request
  // separating xml content from Response to keep clean code.
  const sitePost: ISitemap[] = [
    { loc: HOST_URL, priority: '1.0' },
    { loc: `${HOST_URL}/about`, priority: '0.8' },
    { loc: `${HOST_URL}/posts`, priority: '0.5' },
    { loc: `${HOST_URL}/projects`, priority: '0.2' },
  ];

  // // Post Sitemap
  // getAllPost.forEach((post) => {
  //   const title = post.title.replaceAll(' ', '-');

  //   sitePost.push({
  //     loc: `${HOST_URL}/${post.category}/${title}`,
  //     lastmod: post.lastmod,
  //   });
  // });

  const content = `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${sitePost
      .map(
        (item) =>
          `<url>
        <loc>${encodeURI(item.loc)}</loc>
        ${item.lastmod ? `<lastmod>${item.lastmod}</lastmod>` : ''}
        ${item.priority ? `<priority>${item.priority}</priority>` : ''}
      </url>`,
      )
      .join('')}
    </urlset>
    `;
  // Return the response with the content, a status 200 message, and the appropriate headers for an XML page
  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'xml-version': '1.0',
      encoding: 'UTF-8',
    },
  });
};
