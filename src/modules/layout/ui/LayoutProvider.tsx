import { startTransition, useState } from 'react';

import LayoutContext, { type ILayout } from '@/commons/model/layout';
import useDelayedTrue from '@/commons/model/useDelayedTrue';
import useLoading from '@/commons/model/useLoading';
import Spinner from '@/commons/ui/spinner/Spinner';

interface LayoutProviderProps {
  initialLayout: ILayout;
  children: React.ReactNode;
}

/* -------------------------------------------------------------------------------------------------
 * LayoutProvider
 * 레이아웃 상태를 채우고, API 나 네비게이션이 오래 걸리면 전체 화면 스피너를 띄운다.
 * -----------------------------------------------------------------------------------------------*/
export default function LayoutProvider({ initialLayout, children }: LayoutProviderProps) {
  const [layout, setLayout] = useState(initialLayout);
  const isApiLoading = useDelayedTrue(layout.loading, 1000);
  const isLoading = useLoading();

  const updateLayout = (newLayout: Partial<ILayout>) => {
    startTransition(() => {
      setLayout((prev) => ({ ...prev, ...newLayout }));
    });
  };

  return (
    <>
      {(isApiLoading || isLoading) && <Spinner layout="full" />}
      <LayoutContext.Provider value={{ layout, updateLayout }}>{children}</LayoutContext.Provider>
    </>
  );
}
