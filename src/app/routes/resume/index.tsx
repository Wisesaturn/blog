import { redirect } from '@remix-run/node';

/**
 * @deprecated /about으로 변경 (redirect)
 * @returns
 */
// eslint-disable-next-line import/prefer-default-export
export const loader = () => redirect('/about', 301);
