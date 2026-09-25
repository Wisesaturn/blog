import { ActionFunctionArgs } from 'react-router';

import {
  requestRedeploy,
  verifyWebhookSecret,
  getWebhookPageId,
  createProject,
} from '@/features/publish/index.server';

import { updateProject } from '@/entities/project/index.server';

import convertString from '@/commons/lib/convertString';

export const action = async ({ request }: ActionFunctionArgs) => {
  // 시크릿이 없거나 다르면 Notion 을 읽기 전에 돌려보낸다
  if (!verifyWebhookSecret(request)) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const pageId = getWebhookPageId(await request.json());
    const { body: projectBody, ...project } = await createProject(pageId);
    await updateProject({
      title: convertString(project.plainTitle, 'spaceToDash'),
      meta: project,
      body: projectBody,
      isUpdateProject: true,
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
