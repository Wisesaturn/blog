import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import { useState, useEffect } from 'react';

import { Title } from '@components/Title';
import PostCardSection from '@components/PostCard';

import countDB from '@utils/api/countDB';
import searchAllDB from '@utils/api/searchAllDB';

export async function loader() {
  const countNum = await countDB();
  const searchAllData = await searchAllDB();

  return json({ countNum, data: searchAllData });
}
export default function SearchAllPostPage() {
  const { countNum, data } = useLoaderData();

  return (
    <>
      <Title isContent="📖 포스트" isSubContent={`${countNum}개의 게시물이 존재합니다`} />
      {/* <PostCardSection data={data} /> */}
    </>
  );
}
