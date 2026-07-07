import {
  createCookie,
  json,
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { motion } from 'framer-motion';

import getSnippet from '$features/snippet/api/getSnippet';
import updateSnippet from '$features/snippet/api/updateSnippet';
import SnippetComments from '$features/snippet/ui/atoms/SnippetComments';
import SnippetButtons from '$features/snippet/ui/molecules/SnippetButtons';
import SnippetBox from '$features/snippet/ui/organisms/SnippetBox';

import { ANIMATE_FADE_UP_CONTAINER, ANIMATE_FADE_UP_ITEM } from '$shared/constant/animation';
import convertString from '$shared/lib/convertString';
import formatHeadTags from '$shared/lib/formatHeadTags';
import formatStyleSheet from '$shared/lib/formatStyleSheet';
import codeStyles from '$shared/styles/etc/vscode-prism.css';

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
  const cookieName = convertString(new URL(request.url).pathname, 'urlPathToCookieName');
  const hasUserVisited = createCookie(cookieName, {
    path: '/',
    secure: true,
    httpOnly: true,
    maxAge: 60 * 60 * 0.5,
  });
  const cookieHeader = request.headers.get('Cookie');
  const hasUserVisitedPage = await hasUserVisited.parse(cookieHeader);

  const resolvedSnippet = await getSnippet({ title });

  // ignore view count update if it's development or already has cookie
  if (!hasUserVisitedPage && process.env.NODE_ENV !== 'development') {
    // fire-and-forget: 응답을 블로킹하지 않고 조회수만 비동기로 갱신
    updateSnippet({
      title,
      data: { views: (resolvedSnippet.views || 0) + 1 },
    }).catch((err) => console.error(err));
  }

  return json(
    { snippet: resolvedSnippet },
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
