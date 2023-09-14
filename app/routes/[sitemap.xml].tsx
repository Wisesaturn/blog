interface ISitemap {
  loc: string;
  lastmod?: string;
  priority?: string;
}

const HOST_URL = `https://jaehan.blog`;

// 새로 카테고리 수정할시 'utils/constant/category.ts' 에서 Category 추가
const sitePost: ISitemap[] = [
  { loc: HOST_URL, lastmod: '2023-07-05', priority: '1.0' },
  { loc: `${HOST_URL}/typescript/함수-타입-선언하기`, lastmod: '2023-06-27' },
  { loc: `${HOST_URL}/frontend/쌩-npm으로-MFE-구축하기-(1)-:-개념`, lastmod: `2023-07-05` },
  {
    loc: `${HOST_URL}/react/Loading-Chunk-Failed-:-청크-로드-에러-해결하기`,
    lastmod: `2023-09-15`,
  },
  { loc: `${HOST_URL}/frontend` },
  { loc: `${HOST_URL}/react` },
  { loc: `${HOST_URL}/typescript` },
  { loc: `${HOST_URL}/resume` },
  { loc: `${HOST_URL}/all` },
];

export const loader = () => {
  // handle "GET" request
  // separating xml content from Response to keep clean code.
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
