/* eslint-disable import/prefer-default-export */
import { ActionFunctionArgs, json } from '@remix-run/node';

import createPost from '$features/post/api/createPost';
import updatePost from '$features/post/api/updatePost';

import { PostBody } from '$shared/types/api';
import convertString from '$shared/lib/convertString';

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const body: PostBody<'create'> = await request.json();
    const post = await createPost(body.title);
    await updatePost({
      category: post.category,
      title: convertString(post.plain_title, 'spaceToDash'),
      data: post,
    });
    return json(post);
  } catch (err) {
    return new Response(JSON.stringify(err), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        encoding: 'UTF-8',
      },
    });
  }
};
