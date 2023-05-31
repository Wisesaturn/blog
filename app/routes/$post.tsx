import { Outlet, useLoaderData } from '@remix-run/react';

import Copyright from '@components/Footer/Copyright';
import Header from '@components/Header';
import Footer from '@components/Footer';

import { CATEGORY_DATA } from '@utils/constant/category';

import type { MetaFunction, LoaderArgs } from '@remix-run/node';

export async function loader({ params }: LoaderArgs) {
  try {
    const { post, id } = params;
    const category = CATEGORY_DATA.filter((ele) => {
      return ele.link === post;
    });
    const data = [
      { name: `📚 사툰사툰`, link: '/' },
      {
        name: `${category[0].name}`,
        link: `/${category[0].link}`,
      },
      {
        name: `${id ? decodeURI(id!).replace(/-/g, ' ') : ''}`,
        link: `${id ? decodeURI(id!) : ''}`,
      },
    ];

    return data;
  } catch (err) {
    throw new Error('페이지를 찾을 수 없습니다.');
  }
}

const PostLayout = () => {
  const load = useLoaderData<typeof loader>();

  return (
    <>
      <Header paths={load} />
      <article className="isWrapper flex flex-col min-h-screen">
        <Outlet />
      </article>
      <Copyright />
      <Footer />
    </>
  );
};

export default PostLayout;
