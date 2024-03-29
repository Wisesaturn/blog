/* eslint-disable import/prefer-default-export */
import { ActionFunctionArgs, json } from '@remix-run/node';

import { PostBody } from '$shared/types/api';
import convertString from '$shared/lib/convertString';

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const body: PostBody<'project'> = await request.json();

    return json({});
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
