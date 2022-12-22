import { Link, useLoaderData } from '@remix-run/react';

export const Index = () => {
  return (
    <>
      <header className="flex justify-between">
        <nav>메뉴</nav>
        <div>재한쓰 발자취 😎</div>
        <div>프로필</div>
      </header>
      <section className="flex justify-center max-w-3xl mx-auto w-11/12">
        <h2 className="">반갑습니다</h2>
      </section>
      <section className="max-w-3xl mx-auto w-11/12 flex flex-wrap justify-between align-center">
        <div className="">글 카드 영역</div>
      </section>
    </>
  );
};

export default Index;
