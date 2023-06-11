/* eslint-disable react-hooks/rules-of-hooks */
import { useLoaderData } from '@remix-run/react';
import styles from 'highlight.js/styles/github-dark-dimmed.css';
import { GiShare } from 'react-icons/gi';
import { IoCopy } from 'react-icons/io5';
import { AiFillEye } from 'react-icons/ai';
import { createCookie, redirect } from '@remix-run/node';

import { TWstyleIcon, TWstyleIconWrapper } from '@styles/config';

import { PostTitle } from '@components/Title';

import updateDB from '@utils/api/updateDB';
import fetchDB from '@utils/api/fetchDB';
import { copyPageUrl, sharePage } from '@utils/lib/post';

import type { LoaderArgs, ActionArgs, MetaFunction, LinksFunction } from '@remix-run/node';
import type { INotionPostReturn } from '@Types/post';

export const meta: MetaFunction = ({ data, params }) => {
  const { post, id } = params;
  const { description, thumbnail } = data! as INotionPostReturn;
  const isTitle = `${id} :: 📚 사툰사툰`;
  const isDescription = `${description}`;
  const isURL = `https://jaehan.blog/${post}/${id}`;
  const defaultThumbnail = `https://user-images.githubusercontent.com/79848632/220535309-f7a02b94-5eab-46bf-867c-8c9c82475620.png`;
  return {
    title: isTitle,
    description: isDescription,
    'og:url': isURL,
    'og:title': isTitle,
    'og:image': thumbnail === '' ? defaultThumbnail : thumbnail,
    'og:description': isDescription,
    'twitter:url': isURL,
    'twitter:title': isTitle,
    'twitter:image': thumbnail === '' ? defaultThumbnail : thumbnail,
    'twitter:description': isDescription,
  };
};

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

export async function loader({ params, request }: LoaderArgs) {
  const { post, id } = params;
  const cookieHeader = request.headers.get('Cookie');
  const hasUserVisited = createCookie(`${id}`);

  const hasUserVisitedPage = await hasUserVisited.parse(cookieHeader);

  const isFetchDB = await fetchDB(post!, id!);

  if (id !== '') {
    const updateViews = {
      views: isFetchDB.views ? isFetchDB.views + 1 : 1,
    };

    isFetchDB.views = isFetchDB.views ? isFetchDB.views + 1 : 1;
    await updateDB(post!, id!, updateViews);
  }

  return isFetchDB;
}

export async function action({ request, params }: ActionArgs) {
  const { id } = params;

  const cookieHeader = request.headers.get('Cookie');

  const hasUserVisited = createCookie(`${id}`);

  const hasUserVisitedPage = await hasUserVisited.parse(cookieHeader);

  return redirect('/', {
    headers: {
      'Set-Cookie': await hasUserVisited.serialize(hasUserVisitedPage),
    },
  });
}

export default function ReviewPage() {
  const { thumbnail, title, createdAt, tags, body, views } = useLoaderData();

  return (
    <>
      <PostTitle thumbnail={thumbnail} title={title} createdAt={createdAt} tags={tags} />
      <div className="w-[4rem] rounded-full h-1 mx-auto bg-green-dark my-10" />
      <main className="markdown-body pb-10" dangerouslySetInnerHTML={{ __html: body }} />
      <div className="flex justify-between">
        <div className="flex gap-1.5 text-gray-500 items-center justify-center">
          <AiFillEye size="1rem" />
          <span className="text-left text-lg">{views}</span>
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
