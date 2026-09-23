/* eslint-disable import/prefer-default-export */
import { ActionFunctionArgs } from 'react-router';

import createSnippet from '$features/snippet/api/createSnippet';
import updateSnippet from '$features/snippet/api/updateSnippet';

import requestRedeploy from '$shared/api/requestRedeploy';
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
    const body: PostBody<'snippet'> = await request.json();
    const project = await createSnippet(body.title);
    await updateSnippet({
      title: convertString(project.plainTitle, 'spaceToDash'),
      data: project,
      isUpdateSnippet: true,
    });
    await requestRedeploy();
    return Response.json(project);
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
