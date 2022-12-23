import Header from '@components/Header';
import Footer from '@components/Footer';

export default function ErrorPage() {
  return (
    <>
      <Header isContent="404" />
      <div className="w-full h-full flex flex-col justify-start items-center pt-20 gap-2">
        <h1>ERROR</h1>
        <h4>페이지를 찾을 수 없습니다.</h4>
      </div>
      <Footer />
    </>
  );
}
