import { Outlet, useLoaderData } from '@remix-run/react';

import Copyright from '@components/Footer/Copyright';
import Header from '@components/Header';
import Footer from '@components/Footer';

import { CATEGORY_DATA } from '@utils/constant/category';

import type { MetaFunction, LoaderArgs } from '@remix-run/node';

const PostLayout = () => {
  return (
    <>
      <article className="isWrapper flex flex-col min-h-screen">
        <Outlet />
      </article>
      <Copyright />
      <Footer />
    </>
  );
};

export default PostLayout;
