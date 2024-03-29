import { createContext, useState, startTransition } from 'react';

import { Darkmode, IHeader } from '$shared/types/layout';
import Spinner from '$shared/ui/atoms/indicator/Spinner';
import useLoading from '$shared/hooks/useLoading';
import useDebounce from '$shared/hooks/useDebounce';
import instance from '$shared/api/instance';

export interface ILayout {
  header: IHeader;
  loading: boolean;
  darkmode: Darkmode;
}

export interface ILayoutContext {
  layout: ILayout;
  updateLayout: (layout: Partial<ILayout>) => void;
}

interface LayoutProviderProps {
  initialLayout: ILayout;
  children: React.ReactNode;
}

export const DEFAULT_LAYOUT_VALUE: ILayout = {
  darkmode: 'light',
  loading: false,
  header: {
    title: '',
    category: '',
  },
};

const LayoutContext = createContext<ILayoutContext>({
  layout: DEFAULT_LAYOUT_VALUE,
  updateLayout: () => {},
});

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ initialLayout, children }) => {
  const [layout, setLayout] = useState(initialLayout);
  const debouncedLayoutLoading = useDebounce(layout.loading, 1000);
  const isLoading = useLoading();

  const updateLayout = (newLayout: Partial<ILayout>) => {
    startTransition(() => {
      setLayout((prev) => ({ ...prev, ...newLayout }));
    });
  };

  instance.setUpdateLayout(updateLayout);

  return (
    <>
      {(debouncedLayoutLoading || isLoading) && <Spinner layout="full" />}
      <LayoutContext.Provider value={{ layout, updateLayout }}>{children}</LayoutContext.Provider>
    </>
  );
};

export default LayoutContext;
