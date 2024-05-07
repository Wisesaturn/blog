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
        {/* --------IOS Set-------- */}
        {/* <!-- iPhone ICON --> */}
        <link href="assets/apple-touch-icon-57x57.png" sizes="57x57" rel="apple-touch-icon" />
        {/* <!-- iPad ICON--> */}
        <link href="assets/apple-touch-icon-72x72.png" sizes="72x72" rel="apple-touch-icon" />
        {/* <!-- iPhone (Retina) ICON--> */}
        <link href="assets/apple-touch-icon-114x114.png" sizes="114x114" rel="apple-touch-icon" />
        {/* <!-- iPad (Retina) ICON--> */}
        <link href="assets/apple-touch-icon-144x144.png" sizes="144x144" rel="apple-touch-icon" />
        {/* iPhone default ICON */}
        <link href="assets/apple-touch-icon-180x180.png" sizes="180x180" rel="apple-touch-icon" />
        {/* <!-- iPhone SPLASHSCREEN--> */}
        <link
          href="assets/apple-touch-startup-image-320x460.png"
          media="(device-width: 320px)"
          rel="apple-touch-startup-image"
        />
        {/* <!-- iPhone (Retina) SPLASHSCREEN--> */}
        <link
          href="assets/apple-touch-startup-image-640x920.png"
          media="(device-width: 320px) and (-webkit-device-pixel-ratio: 2)"
          rel="apple-touch-startup-image"
        />
        {/* iPhone default Splash */}
        <link
          href="assets/apple-touch-startup-image-512x512.png"
          media="screen and (device-width: 375px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link rel="shortcut icon" type="image/x-icon" href="assets/favicon.ico" />
        <link rel="icon" type="image/x-icon" href="assets/favicon.ico" />
        <link rel="manifest" href="assets/manifest.webmanifest" />
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
