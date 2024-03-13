import { createContext } from 'react';

export interface IMiddleware {
  env: Record<string, string>;
}

export const DEFAULT_MIDDLEWARE_VALUE: IMiddleware = {
  env: {},
};

const MiddlewareContext = createContext<IMiddleware>(DEFAULT_MIDDLEWARE_VALUE);

export default MiddlewareContext;
