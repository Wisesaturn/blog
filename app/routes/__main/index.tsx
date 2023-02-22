import { Header } from '@components/Header';
import TitleSection from '@components/Section/Title';
import Pagination from '@components/Pagination';
import { Link } from '@remix-run/react';
import Footer from '@components/Footer';
import { useTitle } from '@hooks/index';

export const MainPage = () => {
  const { changeTitle } = useTitle();
  changeTitle('Seize the day');
  
  return (
    <>
      <Header />
      <TitleSection />
      <div className="isWrapper h-full flex flex-col justify-center text-center">
        <div className="p-20">프로필 영역</div>
        <Link to="/review">
          <h2 className="p-20">회고</h2>
        </Link>
      </div>
      <Footer />
    </>
  );
};

export default MainPage;
