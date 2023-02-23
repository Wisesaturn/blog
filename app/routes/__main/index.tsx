import Header from '@components/Header';
import TitleSection from '@components/Section/Title';
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
      <Footer />
    </>
  );
};

export default MainPage;
