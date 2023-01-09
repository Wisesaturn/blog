import PostCardSection from '@components/Section/PostCard';
import Header from '@components/Header';
import Footer from '@components/Footer';
import TitleSection from '@components/Section/Title';
import Pagination from '@components/Pagination';

export const MainPage = () => {
  return (
    <>
      <Header isContent="Seize the day" />
      <TitleSection />
      <PostCardSection />
      <Pagination />
      <Footer />
    </>
  );
};

export default MainPage;
