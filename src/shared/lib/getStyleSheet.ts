import { LinkDescriptor } from '@remix-run/node';

/**
 * @summary link 태그에 stylesheet를 담기 위한 함수
 * @param href
 * @returns
 */
export default function getStyleSheet(href: string): LinkDescriptor {
  return {
    rel: 'stylesheet',
    as: 'style',
    crossOrigin: 'anonymous',
    type: 'text/css',
    href,
  };
}
