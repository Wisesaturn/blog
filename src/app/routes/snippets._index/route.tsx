import { MetaFunction, useLoaderData } from 'react-router';

import { SnippetsPage } from '@/pages/snippets';

import { getSnippets } from '@/entities/snippet/index.server';

import formatHeadTags from '../../lib/formatHeadTags';

// meta
export const meta: MetaFunction = (args) => {
  const urlPrefix = 'snippets';
  const title = 'Snippets';
  return formatHeadTags({ urlPrefix, title, ...args });
};

// loader
// 빌드 때 prerender 로 한 번 돈다 (#119). 조회수는 목록 통계로 브라우저가 받는다
export async function loader() {
  return { snippets: await getSnippets() };
}

export default function Route() {
  const { snippets } = useLoaderData<typeof loader>();
  return <SnippetsPage snippets={snippets} />;
}
