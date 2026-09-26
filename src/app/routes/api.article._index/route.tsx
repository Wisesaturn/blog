import { ActionFunctionArgs } from 'react-router';

import {
  requestRedeploy,
  verifyWebhookSecret,
  getWebhookPageId,
  createPost,
  deleteStore,
  getStoragePaths,
} from '@/features/publish/index.server';

import { PRODUCTION_CATEGORY_DATA } from '@/entities/post';
import { updatePost } from '@/entities/post/index.server';

import convertString from '@/commons/lib/convertString';

export const action = async ({ request }: ActionFunctionArgs) => {
  // 시크릿이 없거나 다르면 Notion 을 읽기 전에 돌려보낸다
  if (!verifyWebhookSecret(request)) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const pageId = getWebhookPageId(await request.json());
    const post = await createPost(pageId);
    const title = convertString(post.plain_title, 'spaceToDash');
    await updatePost({
      category: post.category,
      title,
      data: post,
      isUpdatePost: true,
    });
    // 저장이 성공한 뒤에 옛 파일을 지운다. 그 전에 실패하면 운영 문서가 가리키는 파일이 남아 있어야 한다 (#104)
    await deleteStore({
      collection: 'post',
      category: post.category,
      title,
      keep: getStoragePaths(post.thumbnail, post.body),
    });
    // 개발 전용 카테고리는 굽지 않으므로 재배포할 이유가 없다
    if (PRODUCTION_CATEGORY_DATA.some((c) => c.link === post.category)) {
      await requestRedeploy();
    }
    return Response.json(post);
  } catch (err) {
    if (err instanceof Error) {
      // create* 는 원인을 cause 에 담는다. 로그를 열지 않아도 끊어진 커버 주소 같은 원인이 보이게 함께 돌려준다
      const message =
        err.cause instanceof Error ? `${err.message}\n${err.cause.message}` : err.message;
      return new Response(message, {
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
