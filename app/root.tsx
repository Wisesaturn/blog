import type { MetaFunction, LinksFunction } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import styles from '@styles/tailwind.css';
import { RecoilRoot } from 'recoil';

import { Suspense } from 'react';

import Header from '@components/Header';
import Footer from '@components/Footer';
import { Title } from '@components/Title';

const metaSNS = {
  'og:type': 'website',
  'og:url': 'https://jaehan.blog/',
  'og:title': `Jaehan's blog 📚`,
  'og:image': `https://user-images.githubusercontent.com/79848632/220535309-f7a02b94-5eab-46bf-867c-8c9c82475620.png`,
  'og:description': `기록하고 싶은 것들을 모아두었습니다`,
  'og:locale': `ko_KR`,
  'og:image:width': `1200`,
  'og:image:height': `630`,
};

const metaTwitter = {
  'twitter:card': 'summary',
  'twitter:url': 'https://jaehan.blog/',
  'twitter:title': `Jaehan's blog 📚`,
  'twitter:image': `https://user-images.githubusercontent.com/79848632/220535309-f7a02b94-5eab-46bf-867c-8c9c82475620.png`,
  'twitter:description': `기록하고 싶은 것들을 모아두었습니다`,
};

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: `Jaehan's blog 📚`,
  keywords: 'blog, programming, dev, react, remix, 송재한',
  description: `기록하고 싶은 것들을 모아두었습니다`,
  viewport: 'width=device-width,height=device-height,initial-scale=1,viewport-fit=cover',
  ...metaSNS,
  ...metaTwitter,
});

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

export default function App() {
  return (
    <html lang="ko">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Suspense fallback={<>로딩 중...</>}>
          <RecoilRoot>
            <Outlet />
          </RecoilRoot>
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
    { name: `📚 Jaehan's Blog`, link: '/' },
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
