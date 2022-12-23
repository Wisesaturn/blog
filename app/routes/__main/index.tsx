import PostCard from '@components/PostCard';
import Header from '@components/Header';
import Footer from '@components/Footer';
import Title from './components/title';

export const MainPage = () => {
  return (
    <>
      <Header isContent="헤더 영역" />
      <Title />
      <section className="max-w-3xl mx-auto w-11/12 flex flex-wrap justify-between align-center">
        <PostCard />
      </section>
      <Footer />
    </>
  );
};

export default MainPage;
