import { HeadersFunction, MetaFunction, data, useLoaderData } from 'react-router';
import { motion } from 'motion/react';

import formatHeadTags from '@/shared/lib/formatHeadTags';

import SnippetList from '@/features/snippet/ui/organisms/SnippetList';

import { getSnippets } from '@/entities/snippet/index.server';

import { ANIMATE_FADE_UP_CONTAINER, ANIMATE_FADE_UP_ITEM } from '@/commons/config/animation';
import { LIST_CACHE_CONTROL } from '@/commons/config/cache';
import Title from '@/commons/ui/Title';

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

export default function SnippetsPage() {
  const { snippets } = useLoaderData<typeof loader>();

  return (
    <motion.main
      initial="hidden"
      animate="show"
      variants={ANIMATE_FADE_UP_CONTAINER}
      className="layout min-h-screen"
    >
      <Title
        animation={{
          variants: ANIMATE_FADE_UP_ITEM,
        }}
        title="Code Snippets"
        subtitle="실제로 유용했던 코드 조각들을 모아두었습니다"
      />
      <SnippetList snippets={snippets} animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
    </motion.main>
  );
}
