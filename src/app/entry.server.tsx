/* eslint-disable no-param-reassign */
/**
 * 서버 렌더링 진입점.
 * https://reactrouter.com/api/framework-conventions/entry.server.tsx
 */

import { PassThrough } from 'node:stream';

import { createReadableStreamFromReadable } from '@react-router/node';
import { ServerRouter, createCookie, type AppLoadContext, type EntryContext } from 'react-router';
import { isbot } from 'isbot';
import { renderToPipeableStream } from 'react-dom/server';

import getCookie from '$shared/lib/getCookieOnHeader';

/**
 * 스트리밍이 이 시간을 넘기면 렌더를 끊는다.
 * React Router v7 에서 `ServerRouter` 의 `abortDelay` prop 이 없어져, 타이머로만 남는다.
 */
const ABORT_DELAY = 5_000;

const versionCookie = createCookie('version', {
  path: '/', // make sure the cookie we receive the request on every path
  secure: true, // enable this in prod
  httpOnly: true, // only for server-side usage
  maxAge: 60 * 60 * 24 * 365, // keep the cookie for a year
});

function handleBotRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter context={routerContext} url={request.url} />,
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set('Content-Type', 'text/html');

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          // Log streaming rendering errors from inside the shell.  Don't log
          // errors encountered during initial shell rendering since they'll
          // reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            console.error(error);
          }
        },
      },
    );

    setTimeout(abort, ABORT_DELAY);
  });
}

function handleBrowserRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { version } = routerContext.manifest; // get the build version
    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter context={routerContext} url={request.url} />,
      {
        async onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          /* darkmode set */
          const cookieHeader = request.headers.get('cookie');
          const darkmode = getCookie(cookieHeader, 'color-theme') || 'light';

          // Create a pipe line for stream transformation
          const transformStream = new TransformStream({
            transform(chunk, controller) {
              // Manipulate and modify the data
              const modifiedChunk = chunk
                .toString()
                .replace('<html>', `<html lang="ko" color-theme="${darkmode}>"`);
              controller.enqueue(modifiedChunk);
            },
          });

          // Transform the stream and create a new stream
          const modifiedStream = stream.pipeThrough(transformStream);
          /* darkmode set */

          // set version on cookie
          responseHeaders.append('Set-Cookie', await versionCookie.serialize(version));
          responseHeaders.set('Content-Type', 'text/html');

          // set cache control for browser cache
          responseHeaders.set(
            'Cache-Control',
            'public, max-age=0, stale-while-revalidate=31556952, must-revalidate',
          );
          responseHeaders.set(
            'CDN-Cache-Control',
            'public, max-age=0, stale-while-revalidate=31556952',
          );
          responseHeaders.set(
            'Vercel-CDN-Cache-Control',
            'public, max-age=0, stale-while-revalidate=31556952',
          );

          resolve(
            new Response(modifiedStream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          // Log streaming rendering errors from inside the shell.  Don't log
          // errors encountered during initial shell rendering since they'll
          // reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            console.error(error);
          }
        },
      },
    );

    setTimeout(abort, ABORT_DELAY);
  });
}

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  // This is ignored so we can keep it in the template for visibility.  Feel
  // free to delete this parameter in your app if you're not using it!
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loadContext: AppLoadContext,
) {
  return isbot(request.headers.get('user-agent') || '')
    ? handleBotRequest(request, responseStatusCode, responseHeaders, routerContext)
    : handleBrowserRequest(request, responseStatusCode, responseHeaders, routerContext);
}
