import Header from '@components/Header';
import TitleSection from '@components/Title/Title';
import Pagination from '@components/Pagination';
import { Link, useLocation } from '@remix-run/react';
import Footer from '@components/Footer';

export const MainPage = () => {
  const location = useLocation();

  return (
    <>
      <Header paths={location.pathname.split('/')} />
      <TitleSection />
      <div className="isWrapper h-full flex flex-col justify-center text-center">
        <div className="p-20">프로필 영역</div>
        <Link prefetch="render" to="/review">
          <h2 className="p-20">회고</h2>
        </Link>
      </div>
      <div className="text-gray-400 text-[12px] md:text-sm flex justify-center flex-col items-center bg-gray-200 mt-10 py-6">
        <span>기록하고 싶은 것들을 모아두었습니다.</span>
        <span> © 2023 Copyright by 송재한, based on remix</span>
      </div>
      <Footer />
    </>
  );
};

export default MainPage;
