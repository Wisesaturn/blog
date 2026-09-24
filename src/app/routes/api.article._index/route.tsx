/* eslint-disable import/prefer-default-export */
import { ActionFunctionArgs } from 'react-router';

import createPost from '$features/post/api/createPost';
import updatePost from '$features/post/api/updatePost';

import requestRedeploy from '$shared/api/requestRedeploy';
import verifyWebhookSecret from '$shared/api/verifyWebhookSecret';
import { PRODUCTION_CATEGORY_DATA } from '$shared/constant/category';
import convertString from '$shared/lib/convertString';
import { PostBody } from '$shared/types/api';

export const action = async ({ request }: ActionFunctionArgs) => {
  // 시크릿이 없거나 다르면 Notion 을 읽기 전에 돌려보낸다
  if (!verifyWebhookSecret(request)) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // 임시: Notion 웹훅이 실제로 보내는 본문을 확인하려고 남긴다 (#87). 형식에 맞춰 읽게 바꾼 뒤 지운다
    const raw = await request.text();
    console.warn(`[publish:article] body ${raw}`);
    const body: PostBody<'article'> = JSON.parse(raw);
    const post = await createPost(body.title);
    await updatePost({
      category: post.category,
      title: convertString(post.plain_title, 'spaceToDash'),
      data: post,
      isUpdatePost: true,
    });
    // 개발 전용 카테고리는 굽지 않으므로 재배포할 이유가 없다
    if (PRODUCTION_CATEGORY_DATA.some((c) => c.link === post.category)) {
      await requestRedeploy();
    }
    return Response.json(post);
  } catch (err) {
    if (err instanceof Error) {
      return new Response(err.message, {
        status: 400,
        headers: {
          'Content-Type': 'text/plain',
          encoding: 'UTF-8',
        },
      });
    }
    return null;
  }
};
