import { Outlet } from '@remix-run/react';

import Footer from '@components/Footer';

const ResumeLayout = () => {
  return (
    <>
      <main className="isWrapper relative flex justify-between min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default ResumeLayout;
