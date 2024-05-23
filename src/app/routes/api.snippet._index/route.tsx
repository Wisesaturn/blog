/* eslint-disable import/prefer-default-export */
import { ActionFunctionArgs, json } from '@remix-run/node';

import updateSnippet from '$features/snippet/api/updateSnippet';
import createSnippet from '$features/snippet/api/createSnippet';

import { PostBody } from '$shared/types/api';
import convertString from '$shared/lib/convertString';
import Logger from '$shared/helper/logger';

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      const CannotAccessProductionEnvError = new Error('Cannot access production environment');
      Logger.error(CannotAccessProductionEnvError);
      throw CannotAccessProductionEnvError;
    }
    const body: PostBody<'snippet'> = await request.json();
    const project = await createSnippet(body.title);
    await updateSnippet({
      title: convertString(project.plainTitle, 'spaceToDash'),
      data: project,
      isUpdateSnippet: true,
    });
    return json(project);
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
