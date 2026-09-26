import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import {
  Outlet,
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
  type LinksFunction,
  type MetaFunction,
} from 'react-router';

import formatStyleSheet from '@/commons/lib/formatStyleSheet';
import globalStyles from '@/commons/styles/global.css?url';
import Button from '@/commons/ui/button/Button';

import Document from './ui/Document';
import formatHeadTags from './lib/formatHeadTags';
import useInitialScript from './lib/useGoogleTag';

export const meta: MetaFunction = (args) => formatHeadTags(args);

export const links: LinksFunction = () => [
  // 썸네일과 본문 이미지는 모두 Firebase Storage 공개 주소에서 온다. 이미지는 CORS 없이 받는 요청이라
  // crossorigin 을 붙이면 미리 연 연결을 이미지 요청이 재사용하지 못한다
  { rel: 'preconnect', href: 'https://storage.googleapis.com' },
  formatStyleSheet(
    'https://cdnjs.cloudflare.com/ajax/libs/pretendard/1.3.9/variable/pretendardvariable-dynamic-subset.min.css',
  ),
  formatStyleSheet(globalStyles),
];

/**
 * root 에는 loader 를 두지 않는다. 예전 loader 는 테마 쿠키를 읽어 `<html color-theme>` 에 넣었는데,
 * 상세는 빌드 때 굽고 목록은 CDN 에 캐시해서 그 값이 지금 보는 사람의 것이 아니었다 (#106).
 * 사람마다 다른 값은 root 응답에 싣지 않는다. 테마는 `@/commons/lib/theme` 가 브라우저에서 정한다.
 */
export default function App() {
  // 서버에서 요청마다 새로 만들고, 브라우저에서는 한 번만 만든다. 모듈 전역에 두면 서버에서 사람끼리 캐시가 섞인다
  const [queryClient] = useState(() => new QueryClient());

  useInitialScript();

  return (
    <QueryClientProvider client={queryClient}>
      <Document>
        <Outlet />
      </Document>
    </QueryClientProvider>
  );
}

/**
 * Root Error Boundary
 */
export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  const navigate = useNavigate();

  const goToBack = () => {
    navigate(-1);
  };

  if (isRouteErrorResponse(error)) {
    return (
      <Document>
        <h1 className="w-full text-center pt-16 pb-8">
          {error.status} {error.statusText}
        </h1>
        <div className="w-fit mx-auto h-screen">
          <Button onClick={goToBack}>
            <Button.Text>뒤로가기</Button.Text>
          </Button>
        </div>
      </Document>
    );
  }
  if (error instanceof Error) {
    return (
      <Document>
        <h1 className="w-full text-center pt-16 pb-2">{error.name}</h1>
        <p className="w-full text-center max-w-layout mx-auto break-keep pt-4 pb-8">
          {error.message}
        </p>
        {process.env.NODE_ENV === 'development' && (
          <div className="w-full text-center">
            <p>The stack trace is:</p>
            <pre className="w-full text-sm max-w-layout mx-auto break-keep dark:bg-black bg-gray-200 rounded-md mt-2 mb-8 pt-2 pb-8">
              {error.stack}
            </pre>
          </div>
        )}
        <div className="w-fit mx-auto h-screen">
          <Button onClick={goToBack}>
            <Button.Text>뒤로가기</Button.Text>
          </Button>
        </div>
      </Document>
    );
  }
  return (
    <Document>
      <h1 className="w-full text-center pt-16 pb-8">Unknown Error</h1>
      <div className="w-fit mx-auto h-screen">
        <Button onClick={goToBack}>
          <Button.Text>뒤로가기</Button.Text>
        </Button>
      </div>
    </Document>
  );
}
