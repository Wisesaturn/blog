import { cssBundleHref } from '@remix-run/css-bundle';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
} from '@remix-run/react';
import { Suspense } from 'react';

import tossface from '$shared/styles/etc/tossface.css';
import globalStyles from '$shared/styles/global.css';
import Spinner from '$shared/ui/atoms/indicator/Spinner';
import formatStyleSheet from '$shared/lib/formatStyleSheet';
import useInitialScript from '$shared/hooks/useInitialScript';
import Layout from '$shared/ui/templates/Layout';
import getCookie from '$shared/lib/getCookieOnHeader';
import formatHeadTags from '$shared/lib/formatHeadTags';

import type { LinksFunction, LoaderFunction, MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = (args) => formatHeadTags(args);

export const links: LinksFunction = () => [
  formatStyleSheet(
    'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.7/dist/web/variable/pretendardvariable-dynamic-subset.css',
  ),
  formatStyleSheet(tossface),
  formatStyleSheet(globalStyles),
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
];

export const loader: LoaderFunction = ({ request }) => {
  const cookieHeader = request.headers.get('cookie');
  const darkmode = getCookie(cookieHeader, 'color-theme');

  return json({
    layout: {
      darkmode,
    },
  });
};

export default function App() {
  const data = useLoaderData<GlobalLoaderData>();

  useInitialScript();

  return (
    <html lang="ko" color-theme={data.layout.darkmode}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="content-type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="naver-site-verification" content="379a5ac8e5c6d8d023affe7f0d558e14d67f66f4" />
        <meta name="apple-mobile-web-app-title" content="사툰사툰" />
        <Meta />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="shortcut icon" type="image/ico" href="/favicon.ico" />
        <link rel="icon" type="image/ico" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <Links />
        {process.env.NODE_ENV === 'production' && (
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-3F4JB1BK0P" />
        )}
      </head>
      <body>
        <Suspense fallback={<Spinner layout="full" />}>
          <Layout data={data}>
            <Outlet />
          </Layout>
        </Suspense>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
