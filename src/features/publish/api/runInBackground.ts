import { waitUntil } from '@vercel/functions';

import Logger from '@/commons/lib/logger';

/** 에러와 그 `cause` 를 따라가며 메시지를 모은다. create* 는 끊어진 커버 주소 같은 원인을 두 단계 아래에 담는다 */
function getCauseMessages(err: unknown): string[] {
  const messages: string[] = [];
  let current = err;
  while (current instanceof Error) {
    messages.push(current.message);
    current = current.cause;
  }
  if (current !== undefined) messages.push(String(current));
  return messages;
}

/**
 * @description 응답을 먼저 돌려준 뒤에도 발행 작업이 끝날 때까지 함수를 살려 둔다.
 * Notion 버튼은 응답을 오래 기다리지 않아, 이미지가 많은 문서는 발행이 성공해도 시간 초과가 뜬다 (#134).
 * 응답이 이미 나갔으므로 에러는 던지지 않고 원인을 모두 모아 로그로 남긴다.
 * Vercel 밖(로컬 개발 서버)에서는 `waitUntil` 이 아무것도 하지 않지만 작업은 그대로 끝까지 돈다
 * @param label 로그에 남길 작업 이름
 * @param task 응답 뒤에 이어 갈 작업
 * @returns 작업이 끝나면 풀리는 Promise. 실패해도 reject 하지 않는다
 * @example
 * runInBackground(`${pageId} 프로젝트 발행`, async () => { ... });
 * return Response.json({ pageId }, { status: 202 });
 */
export default function runInBackground(label: string, task: () => Promise<void>): Promise<void> {
  const promise = task()
    .then(() => Logger.success(`${label}을 마쳤습니다.`))
    .catch((err: unknown) => {
      Logger.error(
        new Error(`${label}에 실패했습니다.`, { cause: getCauseMessages(err).join(' ← ') }),
      );
    });

  waitUntil(promise);
  return promise;
}
