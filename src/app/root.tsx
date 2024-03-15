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
import useLoading from '$shared/hooks/useLoading';
import useInitialScript from '$shared/hooks/useInitialScript';
import { CATEGORY_DATA } from '$shared/constant/category';
import Layout from '$shared/ui/templates/Layout';
import getCookie from '$shared/lib/getCookieOnHeader';

import type { LinksFunction, LoaderFunction, MetaFunction } from '@remix-run/node';

const metaSNS = [
  { property: 'og:type', content: 'website' },
  { property: 'og:locale', content: 'ko_KR' },
  { property: 'og:image:width', content: '1200' },
  { property: 'og:image:height', content: '630' },
];

const metaTwitter = [{ name: 'twitter:card', content: 'summary' }];

export const meta: MetaFunction = ({ params }) => {
  const { post } = params;

  const metadata = {
    title: `${post === undefined ? '' : `${post} :: `}📚 사툰사툰`,
    description: `꾸준히 성장하고 싶은 프론트엔드 엔지니어입니다. 저만의 경험과 기록을 담아두었습니다 | error ${CATEGORY_DATA.map(
      (category) => category.name,
    ).join(' ')}`,
    url: `https://jaehan.blog/${post === undefined ? '' : post}`,
    thumbnail: `https://user-images.githubusercontent.com/79848632/220535309-f7a02b94-5eab-46bf-867c-8c9c82475620.png`,
  };

  return [
    {
      title: metadata.title,
    },
    {
      name: 'description',
      content: metadata.description,
    },
    {
      property: 'og:url',
      content: metadata.url,
    },
    {
      property: 'og:title',
      content: metadata.title,
    },
    {
      property: 'og:image',
      content: metadata.thumbnail,
    },
    {
      property: 'og:description',
      content: metadata.description,
    },
    {
      name: 'twitter:url',
      content: metadata.url,
    },
    {
      name: 'twitter:title',
      content: metadata.title,
    },
    {
      property: 'twitter:image',
      content: metadata.thumbnail,
    },
    {
      name: 'twitter:description',
      content: metadata.description,
    },
    ...metaSNS,
    ...metaTwitter,
  ];
};

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
    // middleware: getEnv(),
  });
};

export default function App() {
  const data = useLoaderData<GlobalLoaderData>();
  const isLoading = useLoading();
  useInitialScript();

  return (
    <html lang="ko">
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
          {isLoading && <Spinner layout="full" />}
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
