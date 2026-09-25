import { createContext } from 'react';

import { type Darkmode } from '@/commons/types/layout';

export interface ILayout {
  loading: boolean;
  darkmode: Darkmode;
}

export interface ILayoutContext {
  layout: ILayout;
  updateLayout: (layout: Partial<ILayout>) => void;
}

export const DEFAULT_LAYOUT_VALUE: ILayout = {
  darkmode: 'light',
  loading: false,
};

/**
 * 화면 전체가 함께 보는 레이아웃 상태(다크 모드, 로딩)다.
 * features 의 댓글과 다크 모드 버튼도 읽으므로 commons 에 둔다. 값을 채우는 Provider 는 스피너를
 * 그려야 해서 `modules/layout` 의 `LayoutProvider` 에 있다.
 */
const LayoutContext = createContext<ILayoutContext>({
  layout: DEFAULT_LAYOUT_VALUE,
  updateLayout: () => {},
});

export default LayoutContext;
