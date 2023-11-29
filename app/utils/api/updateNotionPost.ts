import { PRODUCTION_CATEGORY_DATA } from '@utils/constant/category';

import fetchNotionPosts from './fetchNotionPosts';

export default async function updateNotionPost() {
  try {
    await Promise.all(PRODUCTION_CATEGORY_DATA.map((category) => fetchNotionPosts(category.link)));
  } catch (err) {
    return new Response(`<html><body><div>포스팅 요청 에러!</div></body></html>`, {
      status: 400,
      headers: {
        'Content-Type': 'text/html',
        encoding: 'utf-8',
      },
    });
  }

  return new Response(`<html><body><div>포스팅 요청 성공!</div></body></html>`, {
    status: 400,
    headers: {
      'Content-Type': 'text/html',
      encoding: 'utf-8',
    },
  });
}
