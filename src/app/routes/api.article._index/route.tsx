/* eslint-disable import/prefer-default-export */
import { ActionFunctionArgs, json } from '@remix-run/node';

import createPost from '$features/post/api/createPost';
import updatePost from '$features/post/api/updatePost';

import Logger from '$shared/helper/logger';
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
    return json(post);
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
