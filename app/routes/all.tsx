/* eslint-disable camelcase */
import { Outlet } from '@remix-run/react';
import { V2_MetaFunction } from '@remix-run/node';

import Copyright from '@components/Footer/Copyright';
import Header from '@components/Header';
import Footer from '@components/Footer';

import { CATEGORY_DATA } from '@utils/constant/category';

export const meta: V2_MetaFunction = () => {
  const isTitle = `포스트 :: 📚 사툰사툰`;
  const isDescription = `꾸준히 성장하고 싶은 프론트엔드 엔지니어입니다. | ${CATEGORY_DATA.map(
    (category) => category.name,
  ).join(' ')}`;
  const isURL = `https://jaehan.blog/all`;
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
      property: 'og:type',
      content: 'website',
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
      property: 'og:description',
      content: isDescription,
    },
    {
      property: 'og:image',
      content: defaultThumbnail,
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
      name: 'twitter:description',
      content: isDescription,
    },
    {
      property: 'twitter:image',
      content: defaultThumbnail,
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

const SearchAllPostLayout = () => {
  const headerData = [
    { name: `📚 사툰사툰`, link: '/' },
    { name: `전체`, link: '/all' },
  ];

  return (
    <>
      <Header paths={headerData} />
      <main className="isWrapper flex flex-col min-h-screen">
        <Outlet />
      </main>
      <Copyright />
      <Footer />
    </>
  );
};

export default SearchAllPostLayout;
