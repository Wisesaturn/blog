/* eslint-disable react-hooks/rules-of-hooks */
import { useLoaderData } from '@remix-run/react';
import styles from 'highlight.js/styles/github-dark-dimmed.css';

import { PostTitle } from '@components/Title';

import fetchDB from '@utils/api/fetchDB';

import type { LoaderArgs, MetaFunction, LinksFunction } from '@remix-run/node';
import type { INotionPostReturn } from '@Types/post';

export const meta: MetaFunction = ({ data, params }) => {
  const { post, id } = params;
  const { description } = data! as INotionPostReturn;

  const isTitle = `${id} :: 📚 사툰사툰`;
  const isDescription = `${description}`;
  const isURL = `https://jaehan.blog/${post}/${id}`;

  return {
    title: isTitle,
    description: isDescription,
    'og:url': isURL,
    'og:title': isTitle,
    'og:description': isDescription,
    'twitter:url': isURL,
    'twitter:title': isTitle,
    'twitter:description': isDescription,
  };
};

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

export async function loader({ params }: LoaderArgs) {
  const { post, id } = params;

  const isFetchDB = await fetchDB(post!, id!);
  return isFetchDB;
}

export default function ReviewPage() {
  const { thumbnail, title, createdAt, tags, body } = useLoaderData();

  return (
    <>
      <PostTitle thumbnail={thumbnail} title={title} createdAt={createdAt} tags={tags} />
      <div className="w-[4rem] rounded-full h-1 mx-auto bg-green-800 my-10" />
      <div className="markdown-body pb-10" dangerouslySetInnerHTML={{ __html: body }} />
    </>
  );
}
