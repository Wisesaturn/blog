import {
  HeadersFunction,
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
  data,
  useLoaderData,
} from 'react-router';

import { SnippetDetailPage } from '@/pages/snippet-detail';

import { getSnippet } from '@/entities/snippet/index.server';

import codeStyles from '@/commons/styles/etc/code-theme.css?url';
import formatStyleSheet from '@/commons/lib/formatStyleSheet';
import { DETAIL_CACHE_CONTROL } from '@/commons/config/cache';

import formatHeadTags from '../../lib/formatHeadTags';

// meta
export const meta: MetaFunction = (args) => {
  const urlPrefix = 'snippets';
  return formatHeadTags({ urlPrefix, ...args });
};

// link
export const links: LinksFunction = () => [formatStyleSheet(codeStyles)];

/**
 * loader 가 `data()` 에 넣은 헤더는 이 export 가 있어야 문서 응답과 `.data` 응답에 실린다.
 * 없으면 `Cache-Control` 이 빠져 CDN 이 캐시하지 않는다.
 */
export const headers: HeadersFunction = ({ loaderHeaders }) => loaderHeaders;

// loader
export async function loader({ params }: LoaderFunctionArgs) {
  const { title } = params;
  if (!title) throw new Error();

  const resolvedSnippet = await getSnippet({ title });

  return data(
    { snippet: resolvedSnippet },
    {
      headers: {
        'Cache-Control': DETAIL_CACHE_CONTROL,
      },
    },
  );
}

export default function Route() {
  const { snippet } = useLoaderData<typeof loader>();
  return <SnippetDetailPage snippet={snippet} />;
}
