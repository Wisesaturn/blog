import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import { useRef } from 'react';

import PostCardSection from '@components/PostCard';
import { Title } from '@components/Title';
import Button from '@components/Button';

import { CATEGORY_DATA } from '@utils/constant/category';
import type { CategoryType } from '@utils/constant/category';
import searchDB from '@utils/api/searchDB';
import postDB from '@utils/api/postDB';
import fetchNotionPost from '@utils/api/fetchNotionPost';

import type { LoaderArgs } from '@remix-run/node';

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
            className="w-full border-2 border-gray-300 px-4 rounded-md"
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
