/* eslint-disable import/prefer-default-export */
import { ActionFunctionArgs, json } from '@remix-run/node';

import updateSnippet from '$features/snippet/api/updateSnippet';
import createSnippet from '$features/snippet/api/createSnippet';

import { PostBody } from '$shared/types/api';
import convertString from '$shared/lib/convertString';

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const body: PostBody<'snippet'> = await request.json();
    const project = await createSnippet(body.title);
    await updateSnippet({
      title: convertString(project.plainTitle, 'spaceToDash'),
      data: project,
      isUpdateSnippet: true,
    });
    return json(project);
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
