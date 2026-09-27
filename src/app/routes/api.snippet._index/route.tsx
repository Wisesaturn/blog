import { ActionFunctionArgs } from 'react-router';

import {
  requestRedeploy,
  runInBackground,
  verifyWebhookSecret,
  getWebhookPageId,
  createSnippet,
  deleteStore,
  getStoragePaths,
} from '@/features/publish/index.server';

import { updateSnippet } from '@/entities/snippet/index.server';
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
  runInBackground(`${pageId} 스니펫 발행`, async () => {
    const snippet = await createSnippet(pageId);
    const title = convertString({ str: snippet.plainTitle, type: 'spaceToDash' });
    await updateSnippet({
      title,
      data: snippet,
      isUpdateSnippet: true,
    });
    // 조회수와 좋아요를 두는 stats 문서를 만들고 댓글을 달 Notion 페이지를 기록한다 (#117)
    await ensureStat({ kind: 'snippet', key: title, notionPageId: snippet.index });
    // 저장이 성공한 뒤에 옛 파일을 지운다. 그 전에 실패하면 운영 문서가 가리키는 파일이 남아 있어야 한다 (#104)
    await deleteStore({
      collection: 'snippet',
      category: 'snippets',
      title,
      keep: getStoragePaths(snippet.body),
    });
    await requestRedeploy();
  });

  return Response.json({ pageId }, { status: 202 });
};
