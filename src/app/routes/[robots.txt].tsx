/* eslint-disable import/prefer-default-export */
export const loader = () => {
  // handle "GET" request
  // set up our text content that will be returned in the response
  const robotText = `
    User-agent: *
    Allow: /
    Disallow: /19D0364CBBC3C83B6DE272A5814D55E42BB336B27D8458AC91882BE1262A36D3330DB3F7E027CB9290A06749DAAF96D55377E5267F52B163D104A93088009B55/

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
