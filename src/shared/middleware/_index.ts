import { createContext } from 'react';

export interface IMiddleware {
  loading: boolean;
  env: Record<string, string>;
}

export const DEFAULT_MIDDLEWARE_VALUE: IMiddleware = {
  loading: false,
  env: {
    NODE_ENV: 'production',
  },
};

const MiddlewareContext = createContext<IMiddleware>(DEFAULT_MIDDLEWARE_VALUE);

export default MiddlewareContext;
