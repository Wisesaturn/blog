import { createContext } from 'react';

import { Darkmode } from '$shared/types/style';

export interface IMiddleware {
  env: Record<string, string>;
  darkmode: Darkmode;
}

const MiddlewareContext = createContext<IMiddleware>({
  env: {},
  darkmode: 'light',
});

export default MiddlewareContext;
