import { cssBundleHref } from '@remix-run/css-bundle';
import {
  Outlet,
  isRouteErrorResponse,
  json,
  useLoaderData,
  useNavigate,
  useRouteError,
} from '@remix-run/react';

import tossface from '$shared/styles/etc/tossface.css';
import globalStyles from '$shared/styles/global.css';
import formatStyleSheet from '$shared/lib/formatStyleSheet';
import useInitialScript from '$shared/hooks/useInitialScript';
import Layout from '$shared/ui/templates/Layout';
import getCookie from '$shared/lib/getCookieOnHeader';
import formatHeadTags from '$shared/lib/formatHeadTags';
import { DEFAULT_LAYOUT_VALUE } from '$shared/middleware/layout';
import { DEFAULT_MIDDLEWARE_VALUE } from '$shared/middleware/_index';
import Button from '$shared/ui/molecules/Button';

import type { LinksFunction, LoaderFunction, MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = (args) => formatHeadTags(args);

export const links: LinksFunction = () => [
  formatStyleSheet(
    'https://cdnjs.cloudflare.com/ajax/libs/pretendard/1.3.9/variable/pretendardvariable-dynamic-subset.min.css',
  ),
  formatStyleSheet(tossface),
  formatStyleSheet(globalStyles),
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
];

export const loader: LoaderFunction = ({ request }) => {
  const cookieHeader = request.headers.get('cookie');
  const darkmode = getCookie(cookieHeader, 'color-theme') || 'light';

  return json({
    layout: {
      darkmode,
    },
    middleware: {},
  });
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
        <p className="w-full text-center max-w-layout break-keep pt-4 pb-8">{error.message}</p>
        {process.env.NODE_ENV === 'development' && (
          <>
            <p>The stack trace is:</p>
            <pre className="w-full text-sm max-w-layout break-keep pt-2 pb-8">{error.stack}</pre>
          </>
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
