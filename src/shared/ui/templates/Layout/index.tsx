import MiddlewareContext, { IMiddleware } from '$shared/middleware/_index';
import { DEFAULT_LAYOUT_VALUE, LayoutProvider } from '$shared/middleware/layout';

import Copyright from './Copyright';
import Header from './Header';
import NavigationBar from './NavigationBar';

export default function Layout({
  children,
  data,
}: {
  children: React.ReactNode;
  data: IMiddleware;
}) {
  return (
    <MiddlewareContext.Provider value={data}>
      <LayoutProvider initialLayout={DEFAULT_LAYOUT_VALUE}>
        <Header />
        {children}
        <NavigationBar />
        <Copyright />
      </LayoutProvider>
    </MiddlewareContext.Provider>
  );
}
