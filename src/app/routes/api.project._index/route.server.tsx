/* eslint-disable import/prefer-default-export */
import { ActionFunctionArgs, json } from '@remix-run/node';

import createProject from '$features/project/api/createProject';
import updateProject from '$features/project/api/updateProject';

import { PostBody } from '$shared/types/api';
import convertString from '$shared/lib/convertString';

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const body: PostBody<'project'> = await request.json();
    const project = await createProject(body.title);
    await updateProject({
      category: `projects`,
      title: convertString(project.plainTitle, 'spaceToDash'),
      data: project,
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