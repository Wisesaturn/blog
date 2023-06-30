export const loader = () => {
  // handle "GET" request
  // separating xml content from Response to keep clean code.
  const content = `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
      <loc>https://jaehan.blog/</loc>
      <lastmod>2023-06-12T00:15:16+01:00</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.5</priority>
      </url>
      <url>
      <loc>https://jaehan.blog/resume</loc>
      <lastmod>2023-06-20T00:15:16+01:00</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.3</priority>
      </url>
      <url>
      <loc>https://jaehan.blog/typescript/함수-타입-선언하기</loc>
      <lastmod>2023-06-27T15:55:16+01:00</lastmod>
      <changefreq>monthly</changefreq>
      <priority>1.0</priority>
      </url>
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
