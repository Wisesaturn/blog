/* eslint-disable react-hooks/rules-of-hooks */
import { useLoaderData } from '@remix-run/react';
import styles from 'highlight.js/styles/github-dark-dimmed.css';
import { GiShare } from 'react-icons/gi';
import { IoCopy } from 'react-icons/io5';
import { AiFillEye } from 'react-icons/ai';

import { TWstyleIcon, TWstyleIconWrapper } from '@styles/config';

import { PostTitle } from '@components/Title';

import fetchDB from '@utils/api/fetchDB';
import { copyPageUrl, sharePage } from '@utils/lib/post';

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
      <div className="w-[4rem] rounded-full h-1 mx-auto bg-green-dark my-10" />
      <main className="markdown-body pb-10" dangerouslySetInnerHTML={{ __html: body }} />
      <div className="flex justify-between">
        <div className="flex gap-1.5 text-gray-500 items-center justify-center">
          <AiFillEye size="1rem" />
          <span className="text-left text-lg">0</span>
        </div>
        <div className="flex gap-2 w-min">
          <span className={TWstyleIconWrapper} onClick={copyPageUrl}>
            <IoCopy className={TWstyleIcon} size="2.25rem" />
          </span>
          <span className={TWstyleIconWrapper} onClick={sharePage}>
            <GiShare className={TWstyleIcon} size="2.25rem" />
          </span>
        </div>
      </div>
    </>
  );
}
