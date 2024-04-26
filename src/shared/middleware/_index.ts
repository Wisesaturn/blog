import { createContext } from 'react';

export interface IMiddleware {}

export const DEFAULT_MIDDLEWARE_VALUE: IMiddleware = {};

const MiddlewareContext = createContext<IMiddleware>(DEFAULT_MIDDLEWARE_VALUE);

export default MiddlewareContext;
