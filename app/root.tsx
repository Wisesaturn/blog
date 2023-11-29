/* eslint-disable camelcase */
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useTransition,
} from '@remix-run/react';
import { Suspense, createContext } from 'react';
import { json } from '@remix-run/node';

import styles from '@styles/tailwind.css';

import Header from '@components/Header';
import Footer from '@components/Footer';
import { Title } from '@components/Title';

import { getEnv } from '@utils/firebase.server';
import { CATEGORY_DATA } from '@utils/constant/category';

import type { V2_MetaFunction, LinksFunction, LoaderFunction } from '@remix-run/node';

const metaSNS = [
  { property: 'og:type', content: 'website' },
  { property: 'og:locale', content: 'ko_KR' },
  { property: 'og:image:width', content: '1200' },
  { property: 'og:image:height', content: '630' },
];

const metaTwitter = [{ name: 'twitter:card', content: 'summary' }];

export const meta: V2_MetaFunction = ({ params }) => {
  const { post } = params;

  const isTitle = `${post === undefined ? '' : `${post} :: `}📚 사툰사툰`;
  const isDescription = `꾸준히 성장하고 싶은 프론트엔드 엔지니어입니다. 저만의 경험과 기록을 담아두었습니다 | ${CATEGORY_DATA.map(
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
  {
    rel: 'stylesheet',
    as: 'style',
    crossOrigin: 'anonymous',
    type: 'text/css',
    href: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.7/dist/web/variable/pretendardvariable-dynamic-subset.css',
  },
  {
    rel: 'stylesheet',
    as: 'style',
    crossOrigin: 'anonymous',
    type: 'text/css',
    href: 'https://cdn.jsdelivr.net/gh/toss/tossface/dist/tossface.css',
  },
  { rel: 'stylesheet', type: 'text/css', href: styles },
  {
    rel: 'stylesheet',
    type: 'text/css',
    href: 'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css',
  },
];

export const loader: LoaderFunction = () => {
  return json({
    ENV: getEnv(),
  });
};

export const EnvContext = createContext({
  ENV: {},
});

export default function App() {
  const { ENV } = useLoaderData();
  const transition = useTransition();

  const isLoading = transition.state === ('loading' || 'submitting');

  const LoadingSpinner = () => (
    <div className="fixed top-0 left-0 bg-gray-300 dark:bg-[#111] dark:bg-opacity-25 h-full translate-1/2 z-[10000] bg-opacity-25 w-full py-10 flex items-center justify-center">
      <div className="spinner" />
    </div>
  );

  return (
    <html lang="ko">
      <head>
        <meta httpEquiv="content-type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="naver-site-verification" content="379a5ac8e5c6d8d023affe7f0d558e14d67f66f4" />
        <meta charSet="utf-8" />
        <Meta />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="icon" type="image/ico" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <Links />
      </head>
      <body>
        <Suspense fallback={<LoadingSpinner />}>
          {isLoading && <LoadingSpinner />}
          <EnvContext.Provider value={ENV}>
            <Outlet />
          </EnvContext.Provider>
        </Suspense>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary({ error }: any) {
  const ErrorData = [
    { name: `📚 사툰사툰`, link: '/' },
    {
      name: `😥 ERROR`,
      link: `error`,
    },
  ];

  return (
    <html>
      <head>
        <title>{`Error 😥`}</title>
        <Meta />
        <Links />
      </head>
      <body>
        <Header paths={ErrorData} />
        <div className="w-full h-full flex flex-col justify-start items-center gap-2">
          <Title isContent="ERROR" isSubContent={`${error.message}`} />
        </div>
        <Footer />
        <Scripts />
      </body>
    </html>
  );
}
