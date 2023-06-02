/* eslint-disable react-hooks/rules-of-hooks */
import { useLoaderData } from '@remix-run/react';
import styles from 'highlight.js/styles/github-dark-dimmed.css';

import { PostTitle } from '@components/Title';

import fetchDB from '@utils/api/fetchDB';

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

  return fetchDB(post!, id!);
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
