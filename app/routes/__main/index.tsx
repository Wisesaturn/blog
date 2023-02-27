import Header from '@components/Header';
import TitleSection from '@components/Title/Title';
import Pagination from '@components/Pagination';
import { Link, useLoaderData } from '@remix-run/react';
import Footer from '@components/Footer';
import type { CategoryType } from '@utils/constant/category';
import { CATEGORY_DATA } from '@utils/constant/category';

export const MainPage = () => {
  const data = [{ name: `📚 Jaehan's Blog`, link: '/' }];

  return (
    <>
      <Header paths={data} />
      <TitleSection />
      <div className="isWrapper min-h-screen flex flex-col justify-center text-center">
        {CATEGORY_DATA.map((ele: CategoryType) => {
          return (
            <Link key={ele.name} prefetch="render" to={ele.link}>
              <h2 className="p-20">{ele.name}</h2>
            </Link>
          );
        })}
      </div>
      <div className="text-gray-400 text-[12px] md:text-sm flex justify-center flex-col items-center bg-gray-100 mt-10 py-6">
        <span>기록하고 싶은 것들을 모아두었습니다.</span>
        <span> © 2023 Copyright by 송재한, based on remix</span>
      </div>
      <Footer />
    </>
  );
};

export default MainPage;
