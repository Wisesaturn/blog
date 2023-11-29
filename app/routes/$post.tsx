import { Outlet, useLoaderData } from '@remix-run/react';

import Copyright from '@components/Footer/Copyright';
import Header from '@components/Header';
import Footer from '@components/Footer';
import { HeaderProps } from '@components/Header/types';

import { CATEGORY_DATA } from '@utils/constant/category';
import updateNotionPost from '@utils/api/updateNotionPost';

import type { LoaderArgs } from '@remix-run/node';

export async function loader({ params }: LoaderArgs) {
  try {
    const { post, id } = params;

    if (post === process.env.POST_UPDATE_URL) {
      return updateNotionPost() as unknown;
    }

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
        link: `/${category[0].link}/${id ? decodeURI(id!) : ''}`,
      },
    ];
    return data as HeaderProps['paths'];
  } catch (err) {
    throw new Error('페이지를 찾을 수 없습니다.');
  }
}

const PostLayout = () => {
  const data = useLoaderData<typeof loader>();

  if (!Array.isArray(data)) {
    return (
      <>
        <div>포스팅 요청 성공!</div>
      </>
    );
  }

  return (
    <>
      <Header paths={data} />
      <main className="isWrapper flex flex-col min-h-screen">
        <Outlet />
      </main>
      <Copyright />
      <Footer />
    </>
  );
};

export default PostLayout;
