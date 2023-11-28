/* eslint-disable camelcase */
import { useLoaderData } from '@remix-run/react';
import { GiShare } from 'react-icons/gi';
import { IoCopy } from 'react-icons/io5';
import { AiFillEye } from 'react-icons/ai';
import { useState } from 'react';
import { createCookie, json } from '@remix-run/node';

import styles from '@styles/vscode-prism.css';
import { TWstyleIcon, TWstyleIconWrapper } from '@styles/config';

import { PostTitle } from '@components/Title';

import fetchDB from '@utils/api/fetchDB';
import postDB from '@utils/api/postDB';
import sharePage from '@utils/lib/sharePage';
import copyPageUrl from '@utils/lib/copyPageUrl';

import type { LoaderArgs, LinksFunction, V2_MetaFunction } from '@remix-run/node';
import type { IFirebasePostReturn } from '@Types/post';

export const meta: V2_MetaFunction = ({ data, params }) => {
  const { post, id } = params;
  const { description, thumbnail, tags } = data! as IFirebasePostReturn;
  const isTitle = `${id?.replace(/-/g, ' ')} :: 📚 사툰사툰`;
  const isDescription = `${description} | ${tags.map((tag) => tag.name).join(' ')}`;
  const isURL = `https://jaehan.blog/${post}/${id}`;
  const defaultThumbnail = `https://user-images.githubusercontent.com/79848632/220535309-f7a02b94-5eab-46bf-867c-8c9c82475620.png`;

  const metaSNS = [
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'ko_KR' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
  ];

  const metaTwitter = [{ name: 'twitter:card', content: 'summary' }];

  return [
    {
      title: isTitle,
    },
    {
      name: 'description',
      content: isDescription,
    },
    {
      property: 'og:url',
      content: isURL,
    },
    {
      property: 'og:title',
      content: isTitle,
    },
    {
      property: 'og:image',
      content: thumbnail === '' ? defaultThumbnail : thumbnail,
    },
    {
      property: 'og:description',
      content: isDescription,
    },
    {
      name: 'twitter:url',
      content: isURL,
    },
    {
      name: 'twitter:title',
      content: isTitle,
    },
    {
      name: 'twitter:image',
      content: thumbnail === '' ? defaultThumbnail : thumbnail,
    },
    {
      name: 'twitter:description',
      content: isDescription,
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: isURL,
    },
    ...metaSNS,
    ...metaTwitter,
  ];
};

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

export const loader = async ({ params, request }: LoaderArgs) => {
  const { post, id } = params;
  const isFetchDB = await fetchDB(post!, id!);

  const hasUserVisited = createCookie(`${isFetchDB.index}`, {
    path: '/',
    secure: false,
    httpOnly: true,
    maxAge: 60 * 60 * 0.5,
  });
  const cookieHeader = request.headers.get('Cookie');
  const hasUserVisitedPage = await hasUserVisited.parse(cookieHeader);

  if (hasUserVisitedPage || process.env.NODE_ENV === 'development') {
    return isFetchDB;
  }

  const countNewViews = isFetchDB.views ? isFetchDB.views + 1 : 1;

  isFetchDB.views = countNewViews;
  await postDB(post!, id!, { views: countNewViews });

  return json(isFetchDB, {
    headers: {
      'Set-Cookie': await hasUserVisited.serialize({}),
    },
  });
};

export default function ReviewPage() {
  const { thumbnail, title, createdAt, tags, body, views } = useLoaderData();
  const [toastText, setToastText] = useState<string>('');

  const handleCopyPage = () => {
    copyPageUrl();
    setToastText('복사 완료!');

    setTimeout(() => {
      setToastText('');
    }, 2000);
  };

  return (
    <>
      <PostTitle thumbnail={thumbnail} title={title} createdAt={createdAt} tags={tags} />
      <div className="w-[4rem] rounded-full h-1 mx-auto bg-green-dark my-10" />
      <article
        className="markdown-body pb-10 max-w-full"
        dangerouslySetInnerHTML={{ __html: body }}
      />
      <aside className="flex justify-between">
        <div className="flex gap-1.5 text-gray-500 items-center justify-center">
          <AiFillEye size="1rem" />
          <span className="text-left text-lg">{views ?? 0}</span>
        </div>
        <div className="flex gap-2 w-min relative">
          {toastText && (
            <span className="animate-bounceCenterAndFadeOut absolute whitespace-nowrap bg-gray-700 text-gray-50 px-4 py-1 rounded-lg">
              {toastText}
            </span>
          )}
          <span className={TWstyleIconWrapper} onClick={handleCopyPage}>
            <IoCopy className={TWstyleIcon} size="2.25rem" />
          </span>
          <span className={TWstyleIconWrapper} onClick={sharePage}>
            <GiShare className={TWstyleIcon} size="2.25rem" />
          </span>
        </div>
      </aside>
    </>
  );
}
