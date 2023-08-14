interface ISitemap {
  loc : string;
  lastmod? : string;
  priority? : string;
}

const sitePost : ISitemap[] = [
  {loc : 'https://jaehan.blog', lastmod : '2023-07-05', priority : '1.0'},
  {loc : 'https://jaehan.blog/typescript/함수-타입-선언하기', lastmod : '2023-06-27'},
  {loc : 'https://jaehan.blog/frontend/쌩-npm으로-MFE-구축하기-(1)-:-개념', lastmod : '2023-07-05'},
  {loc : 'https://jaehan.blog/frontend'},
  {loc : 'https://jaehan.blog/typescript'},
  {loc : 'https://jaehan.blog/resume'},
  {loc : 'https://jaehan.blog/all'}
]

export const loader = () => {
  // handle "GET" request
  // separating xml content from Response to keep clean code.
  const content = `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${sitePost.map((item) => (
      `<url>
        <loc>${encodeURI(item.loc)}</loc>
        ${item.lastmod ? (`<lastmod>${item.lastmod}</lastmod>`) : ''}
        ${item.priority ? (`<priority>${item.priority}</priority>`) : ''}
      </url>`
    )).join('')}
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
