/* eslint-disable import/prefer-default-export */

import getPosts from '$features/post/api/getPosts';

import convertString from '$shared/lib/convertString';
import { ISitemap } from '$shared/types/global';

export const HOST_URL = `https://jaehan.blog`;

export const loader = async () => {
  const posts = await getPosts({ keyword: '', categories: [] });
  // handle "GET" request
  // separating xml content from Response to keep clean code.
  const sitePost: ISitemap[] = [
    { loc: HOST_URL, priority: '1.0' },
    { loc: `${HOST_URL}/about`, priority: '0.8' },
    { loc: `${HOST_URL}/posts`, priority: '0.5' },
    { loc: `${HOST_URL}/snippets`, priority: '0.5' },
    { loc: `${HOST_URL}/projects`, priority: '0.2' },
  ];

  // Post Sitemap
  posts.forEach((post) => {
    const { title, category, lastmod } = post;
    const convertTitle = convertString(title, 'spaceToDash');
    const loc = `${HOST_URL}/posts/${category}/${convertTitle}`;

    sitePost.push({
      loc,
      lastmod,
    });
  });

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
