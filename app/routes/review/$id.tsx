import { useLoaderData } from '@remix-run/react';
import type { LoaderArgs, LinksFunction } from '@remix-run/node';
import getPost from '@utils/api/getPost';

import styles from '@styles/markdown.css';

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: styles,
    },
  ];
};

export async function loader({ params }: LoaderArgs) {
  const { id } = params;
  return getPost('review', id!);
}

export default function ReviewPage() {
  const post = useLoaderData();

  return (
    <>
      <div className="markdown-body" dangerouslySetInnerHTML={{ __html: post.body }}></div>
    </>
  );
}
