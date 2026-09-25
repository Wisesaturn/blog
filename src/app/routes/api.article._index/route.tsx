import { ActionFunctionArgs } from 'react-router';

import requestRedeploy from '@/shared/api/requestRedeploy';
import verifyWebhookSecret from '@/shared/api/verifyWebhookSecret';
import { PRODUCTION_CATEGORY_DATA } from '@/shared/constant/category';
import getWebhookPageId from '@/shared/lib/getWebhookPageId';

import updatePost from '@/features/post/api/updatePost';
import createPost from '@/features/post/api/createPost';

import convertString from '@/commons/lib/convertString';

export const action = async ({ request }: ActionFunctionArgs) => {
  // 시크릿이 없거나 다르면 Notion 을 읽기 전에 돌려보낸다
  if (!verifyWebhookSecret(request)) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const pageId = getWebhookPageId(await request.json());
    const post = await createPost(pageId);
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
