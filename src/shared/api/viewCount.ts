import { createCookie } from 'react-router';

import viewCookieName, { type ViewKind } from '@/shared/lib/viewCookieName';

/** 조회수 API 가 돌려주는 JSON 본문. 문서가 없으면 `views` 가 `null` 이다 */
export type ViewCountBody = { views: number | null };

/**
 * @description 조회수 API 의 응답을 만든다. 인자는 `new Response(body, init)` 와 같은 순서다
 *
 * 본문은 `{ views }` JSON 이고, 사람마다 결과가 다르므로 언제나 `Cache-Control: no-store` 를 붙인다.
 * @param views 지금 조회수. 문서가 없으면 `null`
 * @param init `status` 와 `headers` 등. 넘긴 헤더 위에 `Content-Type` 과 `Cache-Control` 을 덮어쓴다
 * @returns JSON 응답
 * @example
 * return viewCountResponse(views, { headers: { 'Set-Cookie': setCookie } });
 * return viewCountResponse(null, { status: 404 });
 */
export function viewCountResponse(views: number | null, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json');
  headers.set('Cache-Control', 'no-store');
  const body: ViewCountBody = { views };
  return new Response(JSON.stringify(body), { ...init, headers });
}

interface CountViewOptions {
  request: Request;
  kind: ViewKind;
  /** 쿠키 이름을 만들 글 키. 글은 `카테고리/제목`, 스니펫과 프로젝트는 제목 */
  key: string;
  /** 조회수를 1 올리고 올린 뒤의 값을 돌려준다 */
  increase: () => Promise<number>;
  /** 올리지 않고 지금 값만 돌려준다 */
  read: () => Promise<number>;
}

/** 같은 사람이 이 시간 안에 다시 열면 조회수를 올리지 않는다 */
const VISIT_COOKIE_MAX_AGE = 60 * 30;

/**
 * @description 쿠키가 없을 때만 조회수를 올리고, 어느 쪽이든 지금 조회수와 심을 쿠키를 돌려준다
 *
 * 예전에는 상세 loader 가 조회수를 올리고 쿠키를 심었다. 그 `Set-Cookie` 가 문서 응답에 실려서
 * Vercel CDN 이 상세 페이지를 캐시하지 않았다. 조회수를 API 로 떼어 내면 문서 응답은 캐시되고,
 * 조회수만 이 API 가 매번 처리한다.
 *
 * 개발 환경에서는 올리지 않고 읽기만 한다.
 * @returns 지금 조회수와 `Set-Cookie` 헤더 값
 * @throws `increase` 나 `read` 가 실패하면 그 에러가 그대로 올라온다. 문서가 없을 때가 여기 해당한다
 */
export async function countView(
  options: CountViewOptions,
): Promise<{ views: number; setCookie: string }> {
  const { request, kind, key, increase, read } = options;
  const visited = createCookie(viewCookieName(kind, key), {
    path: '/',
    secure: true,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: VISIT_COOKIE_MAX_AGE,
  });
  const hasVisited = Boolean(await visited.parse(request.headers.get('Cookie')));
  const shouldIncrease = !hasVisited && process.env.NODE_ENV !== 'development';

  const views = shouldIncrease ? await increase() : await read();
  return { views, setCookie: await visited.serialize({}) };
}
