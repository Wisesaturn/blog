/**
 * 서버 렌더링 진입점.
 * https://reactrouter.com/api/framework-conventions/entry.server.tsx
 *
 * 응답 헤더는 여기서 건드리지 않는다. `Cache-Control` 은 라우트의 `headers` export 가 정한다.
 * 예전에는 여기서 모든 HTML 응답의 `Cache-Control` 을 `max-age=0, must-revalidate` 로 덮어쓰고
 * 읽는 곳 없는 `version` 쿠키를 심어서, Vercel CDN 이 브라우저 요청을 한 번도 캐시하지 않았다.
 * 봇 요청은 이 경로를 지나지 않아 curl 로 확인하면 캐시되는 것처럼 보였다.
 */

import { PassThrough } from 'node:stream';

import { createReadableStreamFromReadable } from '@react-router/node';
import { ServerRouter, type AppLoadContext, type EntryContext } from 'react-router';
import { isbot } from 'isbot';
import { renderToPipeableStream, type RenderToPipeableStreamOptions } from 'react-dom/server';

/**
 * 스트리밍이 이 시간을 넘기면 렌더를 끊는다.
 * React Router v7 에서 `ServerRouter` 의 `abortDelay` prop 이 없어져, 타이머로만 남는다.
 */
const ABORT_DELAY = 5_000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  _loadContext: AppLoadContext,
) {
  // 봇과 prerender 는 스트리밍 없이 다 그린 HTML 을 받아야 한다
  const userAgent = request.headers.get('user-agent');
  const readyOption: keyof RenderToPipeableStreamOptions =
    (userAgent && isbot(userAgent)) || routerContext.isSpaMode ? 'onAllReady' : 'onShellReady';

  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let statusCode = responseStatusCode;
    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter context={routerContext} url={request.url} />,
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set('Content-Type', 'text/html');

          resolve(new Response(stream, { headers: responseHeaders, status: statusCode }));

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          statusCode = 500;
          // 셸을 그리는 도중의 에러는 reject 되어 따로 기록되므로, 셸 이후의 에러만 남긴다
          if (shellRendered) {
            console.error(error);
          }
        },
      },
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
