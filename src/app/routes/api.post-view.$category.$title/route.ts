import { type ActionFunctionArgs } from 'react-router';

import { countView, viewCountResponse } from '@/shared/api/viewCount';

import { CATEGORY_DATA } from '@/entities/post';
import { getPost, increasePostViews } from '@/entities/post/index.server';

/**
 * 글 조회수를 올린다. 상세 페이지가 화면을 그린 뒤 한 번 부른다.
 *
 * `category` 는 컬렉션 이름으로 그대로 쓰이므로, 목록에 있는 카테고리가 아니면 받지 않는다.
 * 개발 전용 카테고리는 `CATEGORY_DATA` 에 개발 환경에서만 들어 있다.
 */
export async function action({ request, params }: ActionFunctionArgs) {
  const { category, title } = params;
  if (!category || !title || !CATEGORY_DATA.some((c) => c.link === category)) {
    return viewCountResponse(null, { status: 404 });
  }

  try {
    const { views, setCookie } = await countView({
      request,
      kind: 'post',
      key: `${category}/${title}`,
      increase: () => increasePostViews({ category, title }),
      read: async () => (await getPost({ category, title })).views || 0,
    });
    return viewCountResponse(views, { headers: { 'Set-Cookie': setCookie } });
  } catch (err) {
    console.error(err);
    return viewCountResponse(null, { status: 404 });
  }
}
