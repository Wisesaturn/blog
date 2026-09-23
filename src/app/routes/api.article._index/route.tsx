/* eslint-disable import/prefer-default-export */
import { ActionFunctionArgs } from 'react-router';

import createPost from '$features/post/api/createPost';
import updatePost from '$features/post/api/updatePost';

import requestRedeploy from '$shared/api/requestRedeploy';
import Logger from '$shared/helper/logger';
import { PRODUCTION_CATEGORY_DATA } from '$shared/constant/category';
import convertString from '$shared/lib/convertString';
import { PostBody } from '$shared/types/api';

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      const CannotAccessProductionEnvError = new Error('Cannot access production environment');
      Logger.error(CannotAccessProductionEnvError);
      throw CannotAccessProductionEnvError;
    }
    const body: PostBody<'article'> = await request.json();
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
