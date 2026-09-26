import { flatRoutes } from '@react-router/fs-routes';

import type { RouteConfig } from '@react-router/dev/routes';

/**
 * `app/routes/` 의 파일 이름으로 라우트를 만든다. v2 때부터 쓰던 flat routes 규약이다.
 *
 * React Router v7 은 라우트를 이 파일에 직접 적는 것이 기본이지만, 이 레포는 라우트 파일이
 * 이미 그 규약으로 놓여 있어 `flatRoutes` 로 그대로 읽는다. 폴더 구조를 바꾸는 #89 에서
 * 명시 선언으로 옮길지 다시 판단한다.
 *
 * `ignoredRouteFiles` 는 v2 설정 파일에서 CSS 와 유틸 파일을 라우트로 오인하지 않게
 * 막던 설정이다. flat routes 는 `route.tsx` 와 `_index` 같은 규약 파일만 보므로 필요 없다.
 */
export default flatRoutes() satisfies RouteConfig;
