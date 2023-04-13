import { RemixServer } from '@remix-run/react';
import { renderToString } from 'react-dom/server';

import type { EntryContext } from '@remix-run/node';

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const markup = renderToString(<RemixServer context={remixContext} url={request.url} />);

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set(
    'Cache-Control',
    'public, max-age=3600, s-maxage=86400, stale-while-revalidate=300',
  );

  return new Response(`<!DOCTYPE html>${markup}`, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
