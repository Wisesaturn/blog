import { type ActionFunctionArgs } from 'react-router';

import { countView, viewCountResponse } from '@/features/view-count';

import { getProject, increaseProjectViews } from '@/entities/project/index.server';

/** 프로젝트 조회수를 올린다. 상세 페이지가 화면을 그린 뒤 한 번 부른다. */
export async function action({ request, params }: ActionFunctionArgs) {
  const { title } = params;
  if (!title) return viewCountResponse(null, { status: 404 });

  try {
    const { views, setCookie } = await countView({
      request,
      kind: 'project',
      key: title,
      increase: () => increaseProjectViews({ title }),
      read: async () => (await getProject({ title })).views || 0,
    });
    return viewCountResponse(views, { headers: { 'Set-Cookie': setCookie } });
  } catch (err) {
    console.error(err);
    return viewCountResponse(null, { status: 404 });
  }
}
