import { Suspense } from 'react';
import { Links, LiveReload, Meta, Scripts, ScrollRestoration } from '@remix-run/react';
import { SpeedInsights } from '@vercel/speed-insights/remix';

import MiddlewareContext from '$shared/middleware/_index';
import { DEFAULT_LAYOUT_VALUE, LayoutProvider } from '$shared/middleware/layout';
import Spinner from '$shared/ui/atoms/indicator/Spinner';

import Copyright from './Copyright';
import Header from './Header';
import NavigationBar from './NavigationBar';
import TopButton from './TopButton';

export default function Layout({
  children,
  data,
}: {
  children: React.ReactNode;
  data: GlobalLoaderData;
}) {
  return (
    <html lang="ko" color-theme={data.layout.darkmode}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="content-type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="naver-site-verification" content="379a5ac8e5c6d8d023affe7f0d558e14d67f66f4" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="사툰사툰" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <Meta />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png" />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          href="/android-chrome-512x512.png"
        />
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <Links />
        {process.env.NODE_ENV === 'production' && (
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-3F4JB1BK0P" />
        )}
      </head>
      <body>
        <Suspense fallback={<Spinner layout="full" />}>
          <MiddlewareContext.Provider value={data.middleware}>
            <LayoutProvider initialLayout={{ ...DEFAULT_LAYOUT_VALUE, ...data.layout }}>
              <Header />
              {children}
              <TopButton />
              <NavigationBar />
              <Copyright />
            </LayoutProvider>
          </MiddlewareContext.Provider>
        </Suspense>
        <ScrollRestoration />
        <SpeedInsights />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
