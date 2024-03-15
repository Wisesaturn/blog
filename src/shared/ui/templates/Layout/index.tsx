import MiddlewareContext from '$shared/middleware/_index';
import { DEFAULT_LAYOUT_VALUE, LayoutProvider } from '$shared/middleware/layout';

import Copyright from './Copyright';
import Header from './Header';
import NavigationBar from './NavigationBar';

export default function Layout({
  children,
  data,
}: {
  children: React.ReactNode;
  data: GlobalLoaderData;
}) {
  return (
    <MiddlewareContext.Provider value={data.middleware}>
      <LayoutProvider initialLayout={{ ...DEFAULT_LAYOUT_VALUE, ...data.layout }}>
        <Header />
        {children}
        <NavigationBar />
        <Copyright />
      </LayoutProvider>
    </MiddlewareContext.Provider>
  );
}
