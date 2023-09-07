import { RemixServer } from '@remix-run/react';
import { renderToString } from 'react-dom/server';
import { createCookie } from '@remix-run/node';

import type { EntryContext } from '@remix-run/node';

// help us create the string for the Cache-Control header

const versionCookie = createCookie('version', {
  path: '/', // make sure the cookie we receive the request on every path
  secure: true, // enable this in prod
  httpOnly: true, // only for server-side usage
  maxAge: 60 * 60 * 24 * 365, // keep the cookie for a year
});

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const markup = renderToString(<RemixServer context={remixContext} url={request.url} />);
  const { version } = remixContext.manifest; // get the build version

  responseHeaders.append(
    'Cache-Control',
    'public, s-maxage=31556952, max-age=604800, stale-while-revalidate=31556952',
  );
  responseHeaders.append('Vercel-CDN-Cache-Control', 'public, s-maxage=31556952, max-age=0');

  // Add new headers to the response
  responseHeaders.append('Set-Cookie', await versionCookie.serialize(version));
  responseHeaders.set('Content-Type', 'text/html');

  return new Response(`<!DOCTYPE html>${markup}`, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
