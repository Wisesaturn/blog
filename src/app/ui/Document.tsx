import { Suspense } from 'react';
import { Links, Meta, Scripts, ScrollRestoration } from 'react-router';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

import { AppShell } from '@/modules/layout';

import Spinner from '@/commons/ui/spinner/Spinner';

/**
 * 페인트 전에 `<html color-theme>` 를 정한다. 사용자가 고른 테마(쿠키)가 먼저고, 없으면 시스템 설정을 따른다.
 *
 * 상세 페이지는 빌드 때 구운 HTML 이나 CDN 에 캐시된 HTML 로 나가서, 서버가 쿠키를 읽어 넣은 테마가
 * 지금 보는 사람의 것이 아닐 수 있다. 하이드레이션을 기다리면 다크 모드 사용자에게 밝은 화면이 먼저
 * 보이므로 `<head>` 안에서 동기로 실행한다.
 */
const THEME_SCRIPT = `(function(){try{var m=document.cookie.match(/(?:^|; )color-theme=(dark|light)/);var t=m?m[1]:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('color-theme',t);}catch(e){}})();`;

/* -------------------------------------------------------------------------------------------------
 * Document
 * `<html>` 부터 그리는 문서 셸. 테마 스크립트와 meta, 아이콘, 분석 스크립트를 넣고 본문은 `AppShell` 에 맡긴다.
 * -----------------------------------------------------------------------------------------------*/
export default function Document({
  children,
  data,
}: {
  children: React.ReactNode;
  data: GlobalLoaderData;
}) {
  return (
    // 인라인 스크립트가 color-theme 을 바꾸므로 서버 HTML 과 다를 수 있다
    <html lang="ko" color-theme={data.layout.darkmode} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
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
        <link href="/assets/apple-touch-icon-57x57.png" sizes="57x57" rel="apple-touch-icon" />
        {/* <!-- iPad ICON--> */}
        <link href="/assets/apple-touch-icon-72x72.png" sizes="72x72" rel="apple-touch-icon" />
        {/* <!-- iPhone (Retina) ICON--> */}
        <link href="/assets/apple-touch-icon-114x114.png" sizes="114x114" rel="apple-touch-icon" />
        {/* <!-- iPad (Retina) ICON--> */}
        <link href="/assets/apple-touch-icon-144x144.png" sizes="144x144" rel="apple-touch-icon" />
        {/* iPhone default ICON */}
        <link href="/assets/apple-touch-icon-180x180.png" sizes="180x180" rel="apple-touch-icon" />
        {/* <!-- iPhone SPLASHSCREEN--> */}
        <link
          href="/assets/apple-touch-startup-image-320x460.png"
          media="(device-width: 320px)"
          rel="apple-touch-startup-image"
        />
        {/* <!-- iPhone (Retina) SPLASHSCREEN--> */}
        <link
          href="/assets/apple-touch-startup-image-640x920.png"
          media="(device-width: 320px) and (-webkit-device-pixel-ratio: 2)"
          rel="apple-touch-startup-image"
        />
        {/* iPhone default Splash */}
        <link
          href="/assets/apple-touch-startup-image-512x512.png"
          media="screen and (device-width: 375px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="manifest" href="/assets/manifest.webmanifest" />
        <Links />
        {process.env.NODE_ENV === 'production' && (
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-3F4JB1BK0P" />
        )}
      </head>
      <body>
        <Suspense fallback={<Spinner layout="full" />}>
          <AppShell layout={data.layout}>{children}</AppShell>
        </Suspense>
        <ScrollRestoration />
        <Analytics />
        <SpeedInsights />
        <Scripts />
      </body>
    </html>
  );
}
