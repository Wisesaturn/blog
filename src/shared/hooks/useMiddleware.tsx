import { useContext } from 'react';

import MiddlewareContext, { IMiddleware } from '$shared/middleware/_index';

/**
 * @summary environment 등 서버에서 내려주는 데이터 확인 hook
 * @returns
 */
export default function useMiddleware(): IMiddleware {
  const middleware = useContext(MiddlewareContext);
  if (!middleware) {
    throw new Error('useMiddleware는 Layout 내에서 사용해야 합니다');
  }
  return middleware;
}
