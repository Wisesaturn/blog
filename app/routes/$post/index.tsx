/* eslint-disable camelcase */
import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import { useRef } from 'react';

import { IFirebasePostReturn } from '@Types/post';

import PostCardSection from '@components/PostCard';
import { Title } from '@components/Title';
import Button from '@components/Button';

import { CATEGORY_DATA } from '@utils/constant/category';
import type { CategoryType } from '@utils/constant/category';
import searchDB from '@utils/api/searchDB';
import postDB from '@utils/api/postDB';
import fetchNotionPost from '@utils/api/fetchNotionPost';

import type { LoaderArgs, V2_MetaFunction } from '@remix-run/node';

export const meta: V2_MetaFunction = ({ data, params }) => {
  const { post } = params;
  const isTitle = `${post} :: 📚 사툰사툰`;
  const isPostTitle = data.data as IFirebasePostReturn[];
  const isDescription = `꾸준히 성장하고 싶은 프론트엔드 엔지니어입니다. 저만의 경험과 기록을 담아두었습니다 | ${post} | ${isPostTitle
    .map((posting) => posting.title)
    .slice(0, 5)
    .join(' ')}`;
  const isURL = `https://jaehan.blog/${post}`;
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
      tagName: 'link',
      rel: 'canonical',
      href: isURL,
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
      content: defaultThumbnail,
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
      content: defaultThumbnail,
    },
    {
      name: 'twitter:description',
      content: isDescription,
    },
    {
      name: 'description',
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

export async function loader({ params, request }: LoaderArgs) {
  const { post } = params;

  const url = new URL(request.url);
  const refetch = Boolean(url.searchParams.get('refetch'));
  const title = String(url.searchParams.get('title'));
  const chooseCategory = CATEGORY_DATA.filter((item: CategoryType) => {
    return item.link === post;
  });

  if (post === undefined || title === undefined) {
    throw new Error('Wrong State : development');
  }

  if (refetch) {
    await fetchNotionPost('', title.replace(/\s+/g, '-'))
      .then((notionRes) => {
        postDB(chooseCategory[0].link, title.replace(/\s+/g, '-'), notionRes);
      })
      .catch((err) => {
        console.log('[refetch error]');
        console.log(err);
      });
  }

  const data = await searchDB(post);

  return json({ chooseCategory: chooseCategory[0], data, post: String(post) });
}

export const SelectedPostPage = () => {
  const { chooseCategory, data, post } = useLoaderData<typeof loader>();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const updatePost = async () => {
    const title = inputRef.current?.value;
    window.location.href = `${post}?refetch=true&title=${title}`;

    setTimeout(() => {
      window.location.replace(`${post}`);
    }, 100);
  };

  return (
    <>
      <Title isContent={chooseCategory.name} isContentIcon={chooseCategory.icon} />
      {process.env.NODE_ENV === 'development' && (
        <div className="flex gap-4">
          <input
            ref={inputRef}
            className="w-full border-2 border-gray-300 px-4 rounded-md text-black"
            placeholder="Search할 게시물을 입력해주세요"
          />
          <Button
            onClick={updatePost}
            className="w-full bg-gray-700 text-white hover:bg-gray-800 active:bg-gray-900"
            content="새로고침"
          />
        </div>
      )}
      <PostCardSection data={data} />
    </>
  );
};

export default SelectedPostPage;
