import { LinksFunction, LoaderFunctionArgs, MetaFunction, createCookie } from '@remix-run/node';
import { defer, useLoaderData } from '@remix-run/react';
import { motion } from 'framer-motion';

import getSnippet from '$features/snippet/api/getSnippet';
import SnippetComments from '$features/snippet/ui/atoms/SnippetComments';
import SnippetButtons from '$features/snippet/ui/molecules/SnippetButtons';
import updateSnippet from '$features/snippet/api/updateSnippet';
import SnippetBox from '$features/snippet/ui/organisms/SnippetBox';

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
export async function loader({ params, request }: LoaderFunctionArgs) {
  const { title } = params;
  if (!title) throw new Error();

  // cookie settings
  const hasUserVisited = createCookie(request.url, {
    path: '/',
    secure: true,
    httpOnly: true,
    maxAge: 60 * 60 * 0.5,
  });
  const cookieHeader = request.headers.get('Cookie');
  const hasUserVisitedPage = await hasUserVisited.parse(cookieHeader);

  const snippet = getSnippet({ title }).then(async (resolvedSnippet) => {
    // ignore create cookie if it's development or alreeady has cookie
    if (hasUserVisitedPage || process.env.NODE_ENV === 'development') {
      return resolvedSnippet;
    }

    const updatedSnippet = { ...resolvedSnippet, views: (resolvedSnippet.views || 0) + 1 };

    // update snippet (view only)
    await updateSnippet({
      title,
      data: { views: updatedSnippet.views },
    });

    return updatedSnippet;
  });

  return defer(
    { snippet },
    {
      headers: {
        'Set-Cookie': await hasUserVisited.serialize({}),
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=31556952',
      },
    },
  );
}

export default function SnippetPage() {
  const { snippet } = useLoaderData<typeof loader>();

  return (
    <motion.main
      initial="hidden"
      animate="show"
      variants={ANIMATE_FADE_UP_CONTAINER}
      className="layout min-h-screen"
    >
      <SnippetBox snippet={snippet} animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
      <SnippetButtons animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
      <SnippetComments animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
    </motion.main>
  );
}
