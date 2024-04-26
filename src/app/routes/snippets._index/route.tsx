import { motion } from 'framer-motion';
import { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json, useLoaderData } from '@remix-run/react';
import qs from 'qs';

import SnippetCreater from '$features/snippet/ui/molecules/SnippetCreater';
import SnippetList from '$features/snippet/ui/organisms/SnippetList';
import getSnippets from '$features/snippet/api/getSnippets';

import { ANIMATE_FADE_UP_CONTAINER, ANIMATE_FADE_UP_ITEM } from '$shared/constant/animation';
import Title from '$shared/ui/atoms/Title';
import formatHeadTags from '$shared/lib/formatHeadTags';

// meta
export const meta: MetaFunction = (args) => {
  const urlPrefix = 'snippets';
  const title = '사툰사툰 :: Snippets';
  return formatHeadTags({ urlPrefix, title, ...args });
};

// loader
export async function loader({ request }: LoaderFunctionArgs) {
  const params = qs.parse(request.url.split('?')[1]);
  const searchParams = {
    keyword: String(params.keyword || ''),
  };
  const snippets = await getSnippets(searchParams);

  return json({ snippets });
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
      <SnippetCreater animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
      <SnippetList snippets={snippets} animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
    </motion.main>
  );
}
