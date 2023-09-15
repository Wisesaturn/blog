import { Link, useLoaderData } from '@remix-run/react';
import { SlArrowRight } from 'react-icons/sl';
import { css } from '@emotion/react';
import { Icon } from '@iconify/react';

import { TWstyleIcon, TWstyleIconWrapper } from '@styles/config';

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

  const categoryClass = `flex gap-1 items-center justify-center px-3 py-0.5 md:py-1 md:px-4 rounded-lg border-2 before:hidden font-light duration-200`;

  return (
    <>
      <Header paths={headerData} />
      <main className="isWrapper min-h-screen flex flex-col">
        <TitleSection isContent="사툰사툰" isSubContent="기록하고 싶은 것을 담아보았습니다" />
        <ProfileSection />
        <section className="flex gap-2 whitespace-nowrap flex-wrap text-center mb-8">
          {CATEGORY_DATA.map((item: CategoryType) => {
            return (
              <Link key={item.name} prefetch="none" reloadDocument to={item.link}>
                <div
                  css={css`
                    background-color: ${item.color || '#333'};
                    color: white;
                    border-color: white;
                    :hover {
                      border-color: ${item.color || '#333'};
                      color: ${item.color || '#333'};
                      background-color: white;
                    }
                  `}
                  className={categoryClass}
                >
                  {item.icon && <Icon icon={item.icon} />}
                  {item.name}
                </div>
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
