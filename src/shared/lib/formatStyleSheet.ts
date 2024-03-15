import { LinkDescriptor } from '@remix-run/node';

/**
 * @summary link 태그의 stylesheet 포맷을 추출하는 함수
 * @param href
 * @returns
 */
export default function formatStyleSheet(href: string): LinkDescriptor {
  return {
    rel: 'stylesheet',
    as: 'style',
    crossOrigin: 'anonymous',
    type: 'text/css',
    href,
  };
}
