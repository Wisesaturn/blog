import Header from '@components/Header';
import Footer from '@components/Footer';
import { Title } from '@components/Title';

export default function ErrorPage() {
  const data = [
    { name: `📚 Jaehan's Blog`, link: '/' },
    {
      name: `😥 404 ERROR`,
      link: `404`,
    },
  ];
  return (
    <>
      <Header paths={data} />
      <div className="w-full h-full flex flex-col justify-start items-center gap-2">
        <Title isContent="ERROR" isSubContent="페이지를 찾을 수 없습니다." />
      </div>
      <Footer />
    </>
  );
}
