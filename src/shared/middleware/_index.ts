import { createContext } from 'react';

// 지금은 담는 값이 없다. 빈 interface 는 아무 값이나 받으므로 빈 객체만 받도록 적는다
export type IMiddleware = Record<string, never>;

export const DEFAULT_MIDDLEWARE_VALUE: IMiddleware = {};

const MiddlewareContext = createContext<IMiddleware>(DEFAULT_MIDDLEWARE_VALUE);

export default MiddlewareContext;
