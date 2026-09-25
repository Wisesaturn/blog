import {
  HeadersFunction,
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
  data,
  useLoaderData,
  useParams,
} from 'react-router';
import { motion } from 'motion/react';

import useViewCount from '@/shared/hooks/useViewCount';
import formatHeadTags from '@/shared/lib/formatHeadTags';

import SnippetBox from '@/features/snippet/ui/organisms/SnippetBox';
import SnippetButtons from '@/features/snippet/ui/molecules/SnippetButtons';
import SnippetComments from '@/features/snippet/ui/atoms/SnippetComments';

import { snippetQueries } from '@/entities/snippet';
import { getSnippet } from '@/entities/snippet/index.server';

import codeStyles from '@/commons/styles/etc/vscode-prism.css?url';
import formatStyleSheet from '@/commons/lib/formatStyleSheet';
import { DETAIL_CACHE_CONTROL } from '@/commons/config/cache';
import { ANIMATE_FADE_UP_CONTAINER, ANIMATE_FADE_UP_ITEM } from '@/commons/config/animation';

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

export default function SnippetPage() {
  const { snippet } = useLoaderData<typeof loader>();
  const { title = '' } = useParams();
  const views = useViewCount(snippetQueries.views(title), snippet.views || 0);

  return (
    <motion.main
      initial="hidden"
      animate="show"
      variants={ANIMATE_FADE_UP_CONTAINER}
      className="layout min-h-screen"
    >
      <SnippetBox snippet={{ ...snippet, views }} animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
      <SnippetButtons animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
      <SnippetComments animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
    </motion.main>
  );
}
