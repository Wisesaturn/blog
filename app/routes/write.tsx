import { Outlet } from '@remix-run/react';

import Header from '@components/Header';
import Footer from '@components/Footer';
import { CATEGORY_DATA } from '@utils/constant/category';
import Copyright from '@components/Footer/Copyright';

const WriteLayout = () => {
  const headerData = [
    { name: `📚 사툰사툰`, link: '/' },
    { name: `글 작성`, link: '/write' },
  ];

  return (
    <>
      <Header paths={headerData} />
      <article className="isWrapper flex flex-col min-h-screen">
        <Outlet />
      </article>
      <Copyright />
      <Footer />
    </>
  );
};

export default WriteLayout;
