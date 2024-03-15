import { createContext, useCallback, useState } from 'react';

import { Darkmode, IHeader } from '$shared/types/middleware';

export interface ILayout {
  header: IHeader;
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

  const updateLayout = useCallback((newLayout: Partial<ILayout>) => {
    setLayout((prev) => ({ ...prev, ...newLayout }));
  }, []);

  return (
    <LayoutContext.Provider value={{ layout, updateLayout }}>{children}</LayoutContext.Provider>
  );
};

export default LayoutContext;
