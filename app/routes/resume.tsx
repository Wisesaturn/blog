/* eslint-disable camelcase */
import { Outlet } from '@remix-run/react';
import { V2_MetaFunction } from '@remix-run/node';
import { useEffect } from 'react';

import Footer from '@components/Footer';

import { CATEGORY_DATA } from '@utils/constant/category';

export const meta: V2_MetaFunction = () => {
  const isTitle = `개발자 송재한 이력서 :: 📚 사툰사툰`;
  const isDescription = `꾸준히 성장하고 싶은 프론트엔드 엔지니어입니다. | UX 이론과 클린 코딩에 관심이 많습니다 | 깔끔한 인터페이스와 애니메이션을 구현하는 것을 좋아합니다 | 서비스의 가치는 피드백으로부터 나온다고 믿습니다 | ${CATEGORY_DATA.map(
    (category) => category.name,
  ).join(' ')}`;
  const isURL = `https://jaehan.blog/resume`;
  const resumeThumbnail = `https://jaehan.blog/build/_assets/profile-real-RSY5IPJ3.webp`;

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
      content: resumeThumbnail,
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
      content: resumeThumbnail,
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

const ResumeLayout = () => {
  useEffect(() => {
    const memorizeTheme = localStorage.getItem('color-theme');
    localStorage.setItem('color-theme', 'light');
    document.documentElement.setAttribute('color-theme', 'light');

    return () => {
      localStorage.setItem('color-theme', String(memorizeTheme));
      document.documentElement.setAttribute('color-theme', String(memorizeTheme));
    };
  }, []);

  return (
    <>
      <main className="isWrapper relative flex justify-between min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default ResumeLayout;
