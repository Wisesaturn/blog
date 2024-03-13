import { useContext } from 'react';

import LayoutContext, { ILayoutContext } from '$shared/middleware/layout';

/**
 * @summary Layout용 hook
 * @returns
 */
export default function useLayout(): ILayoutContext {
  const layout = useContext(LayoutContext);
  if (!layout) {
    throw new Error('useLayout는 Layout 내에서 사용해야 합니다');
  }
  return layout;
}
