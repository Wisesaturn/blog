import { createContext } from 'react';

export interface ILayout {
  loading: boolean;
}

export interface ILayoutContext {
  layout: ILayout;
  updateLayout: (layout: Partial<ILayout>) => void;
}

export const DEFAULT_LAYOUT_VALUE: ILayout = {
  loading: false,
};

/**
 * 화면 전체가 함께 보는 레이아웃 상태(로딩)다. 다크 모드는 서버가 모르는 값이라 여기 두지 않고
 * `useDarkmode` 가 문서에서 읽는다. features 도 읽으므로 commons 에 둔다. 값을 채우는 Provider 는 스피너를
 * 그려야 해서 `modules/layout` 의 `LayoutProvider` 에 있다.
 */
const LayoutContext = createContext<ILayoutContext>({
  layout: DEFAULT_LAYOUT_VALUE,
  updateLayout: () => {},
});

export default LayoutContext;
