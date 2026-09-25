import { HeadersFunction, MetaFunction, data, useLoaderData } from 'react-router';

import { SnippetsPage } from '@/pages/snippets';

import { getSnippets } from '@/entities/snippet/index.server';

import { LIST_CACHE_CONTROL } from '@/commons/config/cache';

import formatHeadTags from '../../lib/formatHeadTags';

// meta
export const meta: MetaFunction = (args) => {
  const urlPrefix = 'snippets';
  const title = 'Snippets';
  return formatHeadTags({ urlPrefix, title, ...args });
};

/**
 * loader 가 `data()` 에 넣은 헤더는 이 export 가 있어야 문서 응답과 `.data` 응답에 실린다.
 * 없으면 `Cache-Control` 이 빠져 CDN 이 캐시하지 않는다.
 */
export const headers: HeadersFunction = ({ loaderHeaders }) => loaderHeaders;

// loader
export async function loader() {
  const snippets = await getSnippets();

  return data({ snippets }, { headers: { 'Cache-Control': LIST_CACHE_CONTROL } });
}

export default function Route() {
  const { snippets } = useLoaderData<typeof loader>();
  return <SnippetsPage snippets={snippets} />;
}
