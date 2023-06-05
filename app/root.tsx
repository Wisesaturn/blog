import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import React, { Suspense, createContext } from 'react';
import { json } from '@remix-run/node';

import styles from '@styles/tailwind.css';

import Header from '@components/Header';
import Footer from '@components/Footer';
import { Title } from '@components/Title';

import { getEnv } from '@utils/firebase.server';

import type { MetaFunction, LinksFunction, LoaderFunction } from '@remix-run/node';

const metaSNS = {
  'og:type': 'website',
  'og:url': 'https://jaehan.blog/',
  'og:title': `📚 사툰사툰`,
  'og:image': `https://user-images.githubusercontent.com/79848632/220535309-f7a02b94-5eab-46bf-867c-8c9c82475620.png`,
  'og:description': `기록하고 싶은 것들을 모아두었습니다`,
  'og:locale': `ko_KR`,
  'og:image:width': `1200`,
  'og:image:height': `630`,
};

const metaTwitter = {
  'twitter:card': 'summary',
  'twitter:url': 'https://jaehan.blog/',
  'twitter:title': `📚 사툰사툰`,
  'twitter:image': `https://user-images.githubusercontent.com/79848632/220535309-f7a02b94-5eab-46bf-867c-8c9c82475620.png`,
  'twitter:description': `기록하고 싶은 것들을 모아두었습니다`,
};

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: `📚 사툰사툰`,
  keywords: 'blog, programming, dev, react, remix, 송재한',
  description: `기록하고 싶은 것들을 모아두었습니다`,
  viewport: 'width=device-width,height=device-height,initial-scale=1,viewport-fit=cover',
  ...metaSNS,
  ...metaTwitter,
});

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

  return (
    <html lang="ko">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Suspense fallback={<>로딩 중...</>}>
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
