import { Outlet, useLocation } from '@remix-run/react';
import Header from '@components/Header';
import Footer from '@components/Footer';
import type { MetaFunction } from '@remix-run/node';

const ReviewLayout = () => {
  const location = useLocation();

  return (
    <>
      <Header paths={location.pathname.split('/')} />
      <article className="isWrapper flex flex-col min-h-screen">
        <Outlet />
      </article>
      <Footer />
    </>
  );
};

export default ReviewLayout;
