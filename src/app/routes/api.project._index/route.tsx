/* eslint-disable import/prefer-default-export */
import { ActionFunctionArgs, json } from '@remix-run/node';

import createProject from '$features/project/api/createProject';
import updateProject from '$features/project/api/updateProject';

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
    const body: PostBody<'project'> = await request.json();
    const { body: projectBody, ...project } = await createProject(body.title);
    await updateProject({
      title: convertString(project.plainTitle, 'spaceToDash'),
      meta: project,
      body: projectBody,
      isUpdateProject: true,
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
