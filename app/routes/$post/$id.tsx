import { useLoaderData } from '@remix-run/react';

import getPost from '@utils/api/getPost';
import styles from '@styles/markdown.css';
import { PostTitle } from '@components/Title';

import type { LoaderArgs, LinksFunction } from '@remix-run/node';

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: styles,
    },
  ];
};

export async function loader({ params }: LoaderArgs) {
  const { post, id } = params;
  return getPost(post!, id!);
}

export default function ReviewPage() {
  const post = useLoaderData();

  return (
    <>
      <PostTitle
        thumbnail={post.thumbnail}
        title={post.title}
        createdAt={post.createdAt}
        tags={post.tags}
      />
      <div className="w-[4rem] rounded-full h-1 mx-auto bg-green-800 my-10" />
      <div className="markdown-body pb-10" dangerouslySetInnerHTML={{ __html: post.body }} />
    </>
  );
}
