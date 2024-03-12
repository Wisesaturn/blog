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

import EnvContext, { IMiddleware } from '$shared/middleware/_index';
import tossface from '$shared/styles/tossface.css';
import globalStyles from '$shared/styles/global.css';
import Spinner from '$shared/ui/atoms/indicator/Spinner';
import getStyleSheet from '$shared/lib/getStyleSheet';
import useLoading from '$shared/hooks/useLoading';
import useInitialScript from '$shared/hooks/useInitialScript';
import { CATEGORY_DATA } from '$shared/constant/category';
import Layout from '$shared/ui/templates/Layout';

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

  const isTitle = `${post === undefined ? '' : `${post} :: `}📚 사툰사툰`;
  const isDescription = `꾸준히 성장하고 싶은 프론트엔드 엔지니어입니다. 저만의 경험과 기록을 담아두었습니다 | error ${CATEGORY_DATA.map(
    (category) => category.name,
  ).join(' ')}`;
  const isURL = `https://jaehan.blog/${post === undefined ? '' : post}`;
  const defaultThumbnail = `https://user-images.githubusercontent.com/79848632/220535309-f7a02b94-5eab-46bf-867c-8c9c82475620.png`;

  return [
    {
      title: isTitle,
    },
    {
      name: 'description',
      content: isDescription,
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:url',
      content: isURL,
    },
    {
      property: 'og:title',
      content: isTitle,
    },
    {
      property: 'og:image',
      content: defaultThumbnail,
    },
    {
      property: 'og:description',
      content: isDescription,
    },
    {
      name: 'twitter:url',
      content: isURL,
    },
    {
      name: 'twitter:title',
      content: isTitle,
    },
    {
      property: 'twitter:image',
      content: defaultThumbnail,
    },
    {
      name: 'twitter:description',
      content: isDescription,
    },
    ...metaSNS,
    ...metaTwitter,
  ];
};

export const links: LinksFunction = () => [
  getStyleSheet(
    'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.7/dist/web/variable/pretendardvariable-dynamic-subset.css',
  ),
  getStyleSheet(tossface),
  getStyleSheet(globalStyles),
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
];

export const loader: LoaderFunction = ({ request }) => {
  const cookieHeader = request.headers.get('cookie');
  // const darkmode = getCookieValue(cookieHeader, "color-theme");

  return json({
    env: '',
    darkmode: '',
    // env: getEnv(),
    // darkmode,
  });
};

export default function App() {
  const { env, darkmode } = useLoaderData<IMiddleware>();
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
          <EnvContext.Provider value={{ env, darkmode }}>
            <Layout>
              <Outlet />
            </Layout>
          </EnvContext.Provider>
        </Suspense>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
