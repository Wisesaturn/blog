import { RemixServer } from '@remix-run/react';
import { renderToString } from 'react-dom/server';
import { cacheHeader } from 'pretty-cache-header';
import { createCookie } from '@remix-run/node';

import type { EntryContext } from '@remix-run/node';

// help us create the string for the Cache-Control header

const versionCookie = createCookie('version', {
  path: '/', // make sure the cookie we receive the request on every path
  secure: false, // enable this in prod
  httpOnly: true, // only for server-side usage
  maxAge: 60 * 60 * 24 * 365, // keep the cookie for a year
});

// export default function handleRequest(
//   request: Request,
//   responseStatusCode: number,
//   responseHeaders: Headers,
//   remixContext: EntryContext,
// ) {
//   const markup = renderToString(<RemixServer context={remixContext} url={request.url} />);

//   responseHeaders.set('Content-Type', 'text/html');
//   responseHeaders.set(
//     'Cache-Control',
//     'public, max-age=3600, s-maxage=86400, stale-while-revalidate=300',
//   );

//   return new Response(`<!DOCTYPE html>${markup}`, {
//     headers: responseHeaders,
//     status: responseStatusCode,
//   });
// }

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const markup = renderToString(<RemixServer context={remixContext} url={request.url} />);
  const { version } = remixContext.manifest; // get the build version

  // if the response doesn't already have a cache-control header, add one
  if (!responseHeaders.has('Cache-Control')) {
    responseHeaders.append(
      'Cache-Control',
      cacheHeader({
        public: true, // cache on CDN
        maxAge: '1h', // cache time
        staleWhileRevalidate: '1w', // enables ISR
        staleIfError: '1w', // enables ISR
      }),
    );
  }

  // Add new headers to the response
  responseHeaders.append('Vary', 'Cookie');
  responseHeaders.append('Set-Cookie', await versionCookie.serialize(version));

  responseHeaders.set('Content-Type', 'text/html');
  // responseHeaders.set(
  //   'Cache-Control',
  //   'public, max-age=3600, s-maxage=86400, stale-while-revalidate=300',
  // );

  return new Response(`<!DOCTYPE html>${markup}`, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
