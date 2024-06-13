/* eslint-disable import/prefer-default-export */
export const loader = () => {
  // handle "GET" request
  // set up our text content that will be returned in the response
  const robotText = `
    User-agent: *
    Allow: /

    Sitemap: https://jaehan.blog/sitemap.xml
    `;
  // return the text content, a status 200 success response, and set the content type to text/plain
  return new Response(robotText, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
};
