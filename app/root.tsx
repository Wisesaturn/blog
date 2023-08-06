import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useTransition,
  useCatch,
  useParams,
} from '@remix-run/react';
import { Suspense, createContext } from 'react';
import { json } from '@remix-run/node';
import { Analytics } from '@vercel/analytics/react';

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

  const isTitle = `${post === undefined ? '' : `${post} :: `}📚 사툰사툰 - Jaehan.blog`;
  const isDescription = `안녕하세요 꾸준히 성장하고 싶은 프론트엔드 개발자 송재한입니다. 기록하고 싶은 것들을 모아두었습니다`;
  const isURL = `https://jaehan.blog/${post === undefined ? '' : post}`;

  return {
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
    <div className="fixed top-0 left-0 bg-gray-300 h-full translate-1/2 z-[10000] bg-opacity-25 w-full py-10 flex items-center justify-center">
      <div className="spinner" />
    </div>
  );

  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta charSet="utf-8" />
        <meta http-equiv="content-type" content="text/html" />
        <Meta />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png" />
        <link rel="canonical" href="https://jaehan.blog" />
        <link rel="icon" type="image/ico" href="favicon.ico" />
        <link rel="manifest" href="manifest.json" />
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
        <Analytics />
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
        <Links />
      </head>
      <body>
        <Header paths={ErrorData} />
        <div className="w-full h-full flex flex-col justify-start items-center gap-2">
          <Title isContent="ERROR" isSubContent={`${error.message}`} />
        </div>
        <Footer />
        <Analytics />
        <Scripts />
      </body>
    </html>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  const ErrorData = [
    { name: `📚 사툰사툰`, link: '/' },
    {
      name: `😥 ${caught.status}`,
      link: `error`,
    },
  ];

  return (
    <html>
      <head>
        <title>{caught.status} 😥</title>
        <Links />
      </head>
      <body>
        <Header paths={ErrorData} />
        <div className="w-full h-full flex flex-col justify-start items-center gap-2">
          <Title isContent={String(caught.status)} isSubContent={`${caught.statusText}`} />
        </div>
        <Footer />
        <Analytics />
        <Scripts />
      </body>
    </html>
  );
}
