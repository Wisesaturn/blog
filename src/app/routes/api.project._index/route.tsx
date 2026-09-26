import { ActionFunctionArgs } from 'react-router';

import {
  requestRedeploy,
  verifyWebhookSecret,
  getWebhookPageId,
  createProject,
  deleteStore,
  getStoragePaths,
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
    const title = convertString(project.plainTitle, 'spaceToDash');
    await updateProject({
      title,
      meta: project,
      body: projectBody,
      isUpdateProject: true,
    });
    // 저장이 성공한 뒤에 옛 파일을 지운다. 그 전에 실패하면 운영 문서가 가리키는 파일이 남아 있어야 한다 (#104)
    await deleteStore({
      collection: 'project',
      category: `${project.category}-projects`,
      title,
      keep: getStoragePaths(project.thumbnail, projectBody),
    });
    await requestRedeploy();
    return Response.json(project);
  } catch (err) {
    if (err instanceof Error) {
      // create* 는 원인을 cause 에 담는다. 로그를 열지 않아도 끊어진 커버 주소 같은 원인이 보이게 함께 돌려준다
      const message =
        err.cause instanceof Error ? `${err.message}\n${err.cause.message}` : err.message;
      return new Response(message, {
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
