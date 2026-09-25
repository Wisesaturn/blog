import { ISitemap } from '@/commons/types/global';

import getContentPaths from '../lib/getContentPaths';

export const HOST_URL = `https://jaehan.blog`;

export const loader = async () => {
  const { posts, projects, snippets } = await getContentPaths();
  const sitePost: ISitemap[] = [
    { loc: HOST_URL, priority: '1.00' },
    { loc: `${HOST_URL}/about`, priority: '0.80', changeFreq: 'weekly' },
    { loc: `${HOST_URL}/posts`, priority: '0.80', changeFreq: 'weekly' },
    { loc: `${HOST_URL}/snippets`, priority: '0.80', changeFreq: 'weekly' },
    { loc: `${HOST_URL}/projects`, priority: '0.80', changeFreq: 'weekly' },
    ...posts.map(({ path, lastmod }) => ({
      loc: `${HOST_URL}${path}`,
      lastmod,
      priority: '0.64',
      changeFreq: 'weekly' as const,
    })),
    ...[...projects, ...snippets].map(({ path, lastmod }) => ({
      loc: `${HOST_URL}${path}`,
      lastmod,
      priority: '0.50',
      changeFreq: 'weekly' as const,
    })),
  ];

  const content = `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${sitePost
      .map(
        (item) =>
          `<url>
        <loc>${encodeURI(item.loc)}</loc>
        ${item.lastmod ? `<lastmod>${item.lastmod}</lastmod>` : ''}
        ${item.changeFreq ? `<changefreq>${item.changeFreq}</changefreq>` : ''}
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
