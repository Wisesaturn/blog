import { Outlet } from '@remix-run/react';
import { Header } from '@components/Header';
import Footer from '@components/Footer';
import type { MetaFunction } from '@remix-run/node';
import { useTitle } from '@hooks/index';

const ReviewLayout = () => {
  const { changeTitle } = useTitle();
  changeTitle('🛠 회고');

  return (
    <>
      <Header />
      <article className="isWrapper flex flex-col min-h-screen">
        <Outlet />
      </article>
      <Footer />
    </>
  );
};

export default ReviewLayout;
