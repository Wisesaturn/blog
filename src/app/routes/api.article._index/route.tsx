import { ActionFunctionArgs } from 'react-router';

import {
  requestRedeploy,
  runInBackground,
  verifyWebhookSecret,
  getWebhookPageId,
  createPost,
  deleteStore,
  getStoragePaths,
} from '@/features/publish/index.server';

import { PRODUCTION_CATEGORY_DATA } from '@/entities/post';
import { updatePost } from '@/entities/post/index.server';
import { ensureStat } from '@/entities/stats/index.server';

import convertString from '@/commons/lib/convertString';

export const action = async ({ request }: ActionFunctionArgs) => {
  // 시크릿이 없거나 다르면 Notion 을 읽기 전에 돌려보낸다
  if (!verifyWebhookSecret({ request })) {
    return new Response('Unauthorized', { status: 401 });
  }

  let pageId: string;
  try {
    pageId = getWebhookPageId(await request.json());
  } catch (err) {
    const message = err instanceof Error ? err.message : '요청 본문을 읽지 못했습니다.';
    return new Response(message, {
      status: 400,
      headers: {
        'Content-Type': 'text/plain',
        encoding: 'UTF-8',
      },
    });
  }

  // Notion 버튼은 응답을 오래 기다리지 않는다. 발행은 응답 뒤에 이어 가고 결과는 로그로 확인한다 (#134)
  runInBackground({
    label: `${pageId} 게시물 발행`,
    task: async () => {
      const post = await createPost(pageId);
      const title = convertString({ str: post.plain_title, type: 'spaceToDash' });
      await updatePost({
        category: post.category,
        title,
        data: post,
        isUpdatePost: true,
      });
      // 조회수와 좋아요를 두는 stats 문서를 만들고 댓글을 달 Notion 페이지를 기록한다 (#117)
      await ensureStat({
        kind: 'post',
        key: `${post.category}/${title}`,
        notionPageId: post.index,
      });
      // 저장이 성공한 뒤에 옛 파일을 지운다. 그 전에 실패하면 운영 문서가 가리키는 파일이 남아 있어야 한다 (#104)
      await deleteStore({
        collection: 'post',
        category: post.category,
        title,
        keep: getStoragePaths(post.thumbnail, post.body),
      });
      // 개발 전용 카테고리는 굽지 않으므로 재배포할 이유가 없다
      if (PRODUCTION_CATEGORY_DATA.some((c) => c.link === post.category)) {
        await requestRedeploy();
      }
    },
  });

  return Response.json({ pageId }, { status: 202 });
};
