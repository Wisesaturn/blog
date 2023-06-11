import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import React, { Suspense, createContext, useState, useEffect } from 'react';
import { json } from '@remix-run/node';

import styles from '@styles/tailwind.css';

import Header from '@components/Header';
import Footer from '@components/Footer';
import { Title } from '@components/Title';

import { getEnv } from '@utils/firebase.server';

import type { MetaFunction, LinksFunction, LoaderFunction } from '@remix-run/node';

const metaSNS = {
  'og:type': 'website',
  'og:image': `https://user-images.githubusercontent.com/79848632/220535309-f7a02b94-5eab-46bf-867c-8c9c82475620.png`,
  'og:locale': `ko_KR`,
  'og:image:width': `1200`,
  'og:image:height': `630`,
};

const metaTwitter = {
  'twitter:card': 'summary',
  'twitter:image': `https://user-images.githubusercontent.com/79848632/220535309-f7a02b94-5eab-46bf-867c-8c9c82475620.png`,
};

export const meta: MetaFunction = ({ params }) => {
  const { post } = params;

  const isTitle = `${post === undefined ? '' : `${post} :: `}📚 사툰사툰`;
  const isDescription = `기록하고 싶은 것들을 모아두었습니다`;
  const isURL = `https://jaehan.blog/${post === undefined ? '' : post}`;

  return {
    charset: 'utf-8',
    viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
    title: isTitle,
    description: isDescription,
    'og:url': isURL,
    'og:title': isTitle,
    'og:description': isDescription,
    'twitter:url': isURL,
    'twitter:title': isTitle,
    'twitter:description': isDescription,
    ...metaSNS,
    ...metaTwitter,
  };
};

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

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
  const [showLoadingUI, setShowLoadingUI] = useState<boolean>(false);

  const LoadingSpinner = () => (
    <div className="fixed top-0 left-0 bg-gray-300 h-full translate-1/2 z-[10000] bg-opacity-25 w-full py-10 flex items-center justify-center">
      <div className="spinner" />
    </div>
  );

  return (
    <html lang="ko">
      <head>
        <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
        <Meta />
        <link rel="canonical" href="https://jaehan.blog" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.6/dist/web/static/pretendard.css"
        />
        <link
          href="https://cdn.jsdelivr.net/gh/toss/tossface/dist/tossface.css"
          rel="stylesheet"
          type="text/css"
        />
        <Links />
      </head>
      <body>
        <Suspense fallback={<>로딩 중...</>}>
          {showLoadingUI && <LoadingSpinner />}
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
        <title>Error 😥</title>
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
