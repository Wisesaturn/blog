import { Outlet } from '@remix-run/react';

import Footer from '@components/Footer';

const WriteLayout = () => {
  return (
    <>
      <article className="isWrapper relative flex justify-between min-h-screen">
        <Outlet />
      </article>
      <Footer />
    </>
  );
};

export default WriteLayout;
