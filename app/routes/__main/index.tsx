import { Link, useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { json } from '@remix-run/node';

import Pagination from '@components/Pagination';
import Header from '@components/Header';
import Footer from '@components/Footer';
import TitleSection from '@components/Title/Title';
import Copyright from '@components/Footer/Copyright';
import PostCardSection from '@components/PostCard';
import ProfileSection from '@components/Profile';

import getPosts from '@utils/api/getPosts';
import { CATEGORY_DATA } from '@utils/constant/category';
import type { CategoryType } from '@utils/constant/category';

import type { postingTypes } from '@Types/post';

export const MainPage = () => {
  const headerData = [{ name: `📚 사툰사툰`, link: '/' }];

  return (
    <>
      <Header paths={headerData} />
      <main className="isWrapper min-h-screen flex flex-col">
        <TitleSection isContent="사툰사툰" isSubContent="기록하고 싶은 것을 담아보았습니다" />
        <ProfileSection />
        <section className="flex gap-2 text-center mb-8">
          {CATEGORY_DATA.map((ele: CategoryType) => {
            return (
              <Link key={ele.name} prefetch="render" to={ele.link}>
                <h4 className="py-1 px-4 rounded-lg border-2 before:hidden bg-green-darker font-light text-white duration-200 hover:bg-white border-white hover:text-black hover:border-green-bright">
                  {ele.name}
                </h4>
              </Link>
            );
          })}
        </section>
        <h2>최신글</h2>
      </main>
      <Copyright />
      <Footer />
    </>
  );
};

export default MainPage;
