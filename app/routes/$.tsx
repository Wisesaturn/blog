import Header from '@components/Header';
import Footer from '@components/Footer';
import { Title }from '@components/Title';
import { useLocation } from '@remix-run/react';

export default function ErrorPage() {
  const location = useLocation();
  return (
    <>
      <Header paths={location.pathname.split('/')} />
      <div className="w-full h-full flex flex-col justify-start items-center gap-2">
        <Title isContent="ERROR" isSubContent="페이지를 찾을 수 없습니다." />
      </div>
      <Footer />
    </>
  );
}
