import { Outlet } from '@remix-run/react';
import Header from '@components/Header';
import Footer from '@components/Footer';
import TitleSection from '@components/Section/Title';

const ReviewLayout = () => {
  return (
    <>
      <Header isContent="🛠 회고" />
      <TitleSection isContent="🛠 회고" />
      <article className="isWrapper flex flex-col min-h-screen">
        <Outlet />
      </article>
      <Footer />
    </>
  );
};

export default ReviewLayout;
