import { Outlet } from '@remix-run/react';

import Copyright from '@components/Footer/Copyright';
import Header from '@components/Header';
import Footer from '@components/Footer';

const SearchAllPostLayout = () => {
  const headerData = [
    { name: `📚 사툰사툰`, link: '/' },
    { name: `전체`, link: '/all' },
  ];

  return (
    <>
      <Header paths={headerData} />
      <main className="isWrapper flex flex-col min-h-screen">
        <Outlet />
      </main>
      <Copyright />
      <Footer />
    </>
  );
};

export default SearchAllPostLayout;
