/* eslint-disable import/prefer-default-export */
import { ActionFunctionArgs, json } from '@remix-run/node';

import createPost from '$features/post/api/createPost';

import { PostBody } from '$shared/types/api';

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const body: PostBody<'create'> = await request.json();
    const post = await createPost(body.title);
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
