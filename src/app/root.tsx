import {
  Outlet,
  isRouteErrorResponse,
  useLoaderData,
  useNavigate,
  useRouteError,
  type LinksFunction,
  type LoaderFunction,
  type MetaFunction,
  type ShouldRevalidateFunction,
} from 'react-router';

import useInitialScript from '@/shared/hooks/useInitialScript';
import formatHeadTags from '@/shared/lib/formatHeadTags';
import { DEFAULT_MIDDLEWARE_VALUE } from '@/shared/middleware/_index';
import Layout from '@/shared/ui/templates/Layout';

import formatStyleSheet from '@/commons/lib/formatStyleSheet';
import getCookie from '@/commons/lib/getCookieOnHeader';
import { DEFAULT_LAYOUT_VALUE } from '@/commons/model/layout';
import globalStyles from '@/commons/styles/global.css?url';
import Button from '@/commons/ui/button/Button';

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
 * root loader 는 테마 쿠키만 읽으므로 쿼리스트링이 바뀌어도 결과가 같다.
 * 목록의 검색과 필터는 쿼리스트링만 바꾸는데, 이걸 막지 않으면 조작할 때마다 root 의 `.data` 요청이
 * 서버 함수까지 간다. 경로가 바뀌거나 action 을 거칠 때는 기본 동작대로 다시 읽는다.
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentUrl,
  nextUrl,
  formMethod,
  defaultShouldRevalidate,
}) => {
  if (formMethod) return defaultShouldRevalidate;
  if (currentUrl.pathname === nextUrl.pathname) return false;
  return defaultShouldRevalidate;
};

export const loader: LoaderFunction = ({ request }) => {
  const cookieHeader = request.headers.get('cookie');
  const darkmode = getCookie(cookieHeader, 'color-theme') || 'light';

  return {
    layout: {
      darkmode,
    },
    middleware: {},
  };
};

export default function App() {
  const data = useLoaderData<GlobalLoaderData>();

  useInitialScript();

  return (
    <Layout data={data}>
      <Outlet />
    </Layout>
  );
}

/**
 * Root Error Boundary
 */
export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  const navigate = useNavigate();
  const data = {
    layout: DEFAULT_LAYOUT_VALUE,
    middleware: DEFAULT_MIDDLEWARE_VALUE,
  };

  const goToBack = () => {
    navigate(-1);
  };

  if (isRouteErrorResponse(error)) {
    return (
      <Layout data={data}>
        <h1 className="w-full text-center pt-16 pb-8">
          {error.status} {error.statusText}
        </h1>
        <div className="w-fit mx-auto h-screen">
          <Button onClick={goToBack}>
            <Button.Text>뒤로가기</Button.Text>
          </Button>
        </div>
      </Layout>
    );
  }
  if (error instanceof Error) {
    return (
      <Layout data={data}>
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
      </Layout>
    );
  }
  return (
    <Layout data={data}>
      <h1 className="w-full text-center pt-16 pb-8">Unknown Error</h1>
      <div className="w-fit mx-auto h-screen">
        <Button onClick={goToBack}>
          <Button.Text>뒤로가기</Button.Text>
        </Button>
      </div>
    </Layout>
  );
}
