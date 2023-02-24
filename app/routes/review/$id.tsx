import { useLoaderData } from '@remix-run/react';
import type { LoaderArgs, LinksFunction } from '@remix-run/node';
import getPost from '@utils/api/getPost';

import styles from '@styles/markdown.css';
import { PostTitle } from '@components/Title';

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
      <PostTitle title={post.title} createdAt={new Date(post.createdAt).toLocaleString()} count={post.count} tags={post.tags} commentsSize={post.comments.length} />
      <div className="w-[4rem] rounded-full h-1 mx-auto bg-green-800 my-10"/>
      <div className="markdown-body pb-10" dangerouslySetInnerHTML={{ __html: post.body }} />
    </>
  );
}
