import Header from '@components/Header';
import Footer from '@components/Footer';
import TitleSection from '@components/Section/Title';
import Pagination from '@components/Pagination';
import { Link } from '@remix-run/react';

export const MainPage = () => {
  return (
    <>
      <Header isContent="Seize the day" />
      <TitleSection />
      <div className="isWrapper h-full flex flex-col justify-center text-center">
        <div className="p-20">프로필 영역</div>
        <Link to="/project">
          <h2 className="p-20">프로젝트 회고</h2>
        </Link>
      </div>
      <Footer />
    </>
  );
};

export default MainPage;
