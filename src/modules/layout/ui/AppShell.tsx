import { DEFAULT_LAYOUT_VALUE } from '@/commons/model/layout';

import Copyright from './Copyright';
import Header from './Header';
import LayoutProvider from './LayoutProvider';
import NavigationBar from './NavigationBar';
import TopButton from './TopButton';

interface AppShellProps {
  children: React.ReactNode;
}

/* -------------------------------------------------------------------------------------------------
 * AppShell
 * 모든 페이지를 감싸는 화면 셸. 헤더, 본문, 위로 가기 버튼, 하단 내비게이션, 푸터 순으로 그린다.
 * `<html>` 과 `<head>` 는 app 의 `Document` 가 그린다. 둘을 나눠서 Storybook 에서 이 셸만 그릴 수 있다.
 * -----------------------------------------------------------------------------------------------*/
export default function AppShell({ children }: AppShellProps) {
  return (
    <LayoutProvider initialLayout={DEFAULT_LAYOUT_VALUE}>
      <Header />
      {children}
      <TopButton />
      <NavigationBar />
      <Copyright />
    </LayoutProvider>
  );
}
