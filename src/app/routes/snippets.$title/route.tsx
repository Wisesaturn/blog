import { LinksFunction, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json, useLoaderData } from '@remix-run/react';
import { motion } from 'framer-motion';

import getSnippet from '$features/snippet/api/getSnippet';
import SnippetComments from '$features/snippet/ui/atoms/SnippetComments';
import SnippetTitle from '$features/snippet/ui/molecules/SnippetTitle';
import SnippetButtons from '$features/snippet/ui/molecules/SnippetButtons';

import { ANIMATE_FADE_UP_CONTAINER, ANIMATE_FADE_UP_ITEM } from '$shared/constant/animation';
import formatHeadTags from '$shared/lib/formatHeadTags';
import codeStyles from '$shared/styles/etc/vscode-prism.css';
import formatStyleSheet from '$shared/lib/formatStyleSheet';

// meta
export const meta: MetaFunction = (args) => {
  const urlPrefix = 'snippets';
  return formatHeadTags({ urlPrefix, ...args });
};

// link
export const links: LinksFunction = () => [formatStyleSheet(codeStyles)];

// loader
export async function loader({ params }: LoaderFunctionArgs) {
  const { title } = params;
  if (!title) throw new Error();

  const snippet = await getSnippet({ title });
  return json({ snippet });
}

export default function SnippetPage() {
  const { snippet } = useLoaderData<typeof loader>();
  const { body, ...rest } = snippet;

  return (
    <motion.main
      initial="hidden"
      animate="show"
      variants={ANIMATE_FADE_UP_CONTAINER}
      className="layout min-h-screen"
    >
      <SnippetTitle {...rest} animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
      <motion.div
        variants={ANIMATE_FADE_UP_ITEM}
        className="flex w-full max-w-layout max-md:flex-col-reverse"
      >
        <motion.article
          variants={ANIMATE_FADE_UP_ITEM}
          className="markdown-body w-full"
          dangerouslySetInnerHTML={{ __html: body }}
        />
      </motion.div>
      <SnippetButtons animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
      <SnippetComments animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
    </motion.main>
  );
}
