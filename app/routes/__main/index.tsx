import { Link, useLoaderData } from '@remix-run/react';
import { SlArrowRight } from 'react-icons/sl';

import { TWstyleIcon, TWstyleIconWrapper } from '@styles/config';

import Pagination from '@components/Pagination';
import Header from '@components/Header';
import Footer from '@components/Footer';
import TitleSection from '@components/Title/Title';
import Copyright from '@components/Footer/Copyright';
import ProfileSection from '@components/Profile';
import PostListSection from '@components/PostList';

import { CATEGORY_DATA } from '@utils/constant/category';
import type { CategoryType } from '@utils/constant/category';
import searchAllDB from '@utils/api/searchAllDB.server';

export async function loader() {
  const searchAllData = await searchAllDB(5);

  return searchAllData;
}

export const MainPage = () => {
  const headerData = [{ name: `📚 사툰사툰`, link: '/' }];
  const recentDB = useLoaderData();

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
                <h4 className="py-1 px-4 rounded-lg border-2 before:hidden bg-green-main font-light text-white duration-200 hover:bg-white border-white hover:text-black hover:border-green-bright">
                  {ele.name}
                </h4>
              </Link>
            );
          })}
        </section>
        <div className="flex justify-between items-center">
          <h2>최신글</h2>
          <span className={`${TWstyleIconWrapper} h-min`}>
            <Link to="all" aria-label="show all my posts">
              <SlArrowRight className={`${TWstyleIcon}`} size="1.75rem" />
            </Link>
          </span>
        </div>
        <PostListSection data={recentDB} />
      </main>
      <Copyright />
      <Footer />
    </>
  );
};

export default MainPage;
