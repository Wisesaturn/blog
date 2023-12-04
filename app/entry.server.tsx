import { RemixServer } from '@remix-run/react';
import { renderToString } from 'react-dom/server';
import { createCookie } from '@remix-run/node';
import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import createCache from '@emotion/cache';

import getCookieValue from '@utils/lib/getCookieValue';

import type { EntryContext } from '@remix-run/node';

// set emotion server
const key = 'css';
const cache = createCache({ key });
const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache);

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
  const markup = renderToString(
    <CacheProvider value={cache}>
      <RemixServer context={remixContext} url={request.url} />
    </CacheProvider>,
  );

  const requestUrl = request.url;
  const cookieHeader = request.headers.get('cookie');
  const darkmode = getCookieValue(cookieHeader, 'color-theme') || 'light';
  const themeMarkup = requestUrl.split('/')[3].includes('resume')
    ? markup
    : markup.replace('<html', `<html color-theme="${darkmode}"`);

  const chunks = extractCriticalToChunks(markup);
  const styles = constructStyleTagsFromChunks(chunks);

  const { version } = remixContext.manifest; // get the build version

  // Add new headers to the response
  responseHeaders.append('Set-Cookie', await versionCookie.serialize(version));
  responseHeaders.set('Content-Type', 'text/html');

  return new Response(`<!DOCTYPE html>${themeMarkup}${styles}`, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
