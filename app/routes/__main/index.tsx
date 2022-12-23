import PostCardSection from '@components/Section/PostCard';
import Header from '@components/Header';
import Footer from '@components/Footer';
import TitleSection from '@components/Section/Title';

export const MainPage = () => {
  return (
    <>
      <Header isContent="헤더 영역" />
      <TitleSection />
      <PostCardSection />
      <Footer />
    </>
  );
};

export default MainPage;
