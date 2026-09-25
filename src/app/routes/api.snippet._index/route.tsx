import { ActionFunctionArgs } from 'react-router';

import requestRedeploy from '@/shared/api/requestRedeploy';
import verifyWebhookSecret from '@/shared/api/verifyWebhookSecret';
import getWebhookPageId from '@/shared/lib/getWebhookPageId';

import updateSnippet from '@/features/snippet/api/updateSnippet';
import createSnippet from '@/features/snippet/api/createSnippet';

import convertString from '@/commons/lib/convertString';

export const action = async ({ request }: ActionFunctionArgs) => {
  // 시크릿이 없거나 다르면 Notion 을 읽기 전에 돌려보낸다
  if (!verifyWebhookSecret(request)) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const pageId = getWebhookPageId(await request.json());
    const project = await createSnippet(pageId);
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
