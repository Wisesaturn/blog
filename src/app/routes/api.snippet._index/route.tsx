/* eslint-disable import/prefer-default-export */
import { ActionFunctionArgs } from 'react-router';

import createSnippet from '$features/snippet/api/createSnippet';
import updateSnippet from '$features/snippet/api/updateSnippet';

import requestRedeploy from '$shared/api/requestRedeploy';
import verifyWebhookSecret from '$shared/api/verifyWebhookSecret';
import convertString from '$shared/lib/convertString';
import { PostBody } from '$shared/types/api';

export const action = async ({ request }: ActionFunctionArgs) => {
  // 시크릿이 없거나 다르면 Notion 을 읽기 전에 돌려보낸다
  if (!verifyWebhookSecret(request)) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // 임시: Notion 웹훅이 실제로 보내는 본문을 확인하려고 남긴다 (#87). 형식에 맞춰 읽게 바꾼 뒤 지운다
    const raw = await request.text();
    console.warn(`[publish:snippet] body ${raw}`);
    const body: PostBody<'snippet'> = JSON.parse(raw);
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
