import profile from '@public/profile-real.webp';

export const ResumePage = () => {
  return (
    <>
      <section className="w-full">
        <h1 className="text-center py-10 font-light space-x-2">
          <span className="text-gray-200">{'<'}</span>
          <span className="text-gray-600">
            안녕하세요 <span className="text-black font-semibold">송재한</span> 입니다
          </span>
          <span className="text-gray-200">{'/>'}</span>
        </h1>
        <div className="flex md:flex-row flex-col items-center justify-center md:space-x-10 w-full pb-16">
          <img
            className="animate-skeletonUI inline-block min-w-[15rem] w-60 h-60 object-cover rounded-full"
            src={profile}
            alt="프로필 사진"
          />
          <article className="text-justify leading-loose">
            <p>
              <strong>UX 이론</strong>과 <strong>클린 코딩</strong>에 관심이 많습니다.
            </p>
            <p>
              <strong>깔끔한 인터페이스</strong>와 <strong>애니메이션</strong>을 구현하는 것을
              좋아합니다.
            </p>
            <p>
              서비스의 가치는 <strong>피드백</strong>으로부터 나온다고 믿습니다.
            </p>
          </article>
        </div>
        <div className="block space-y-10">
          <div className="h-full">
            <h2 className="text-2xl">타이틀</h2>
            <p>내용</p>
          </div>
          <div className="h-full">
            <h2 className="text-2xl">타이틀</h2>
            <p>내용</p>
          </div>
        </div>
      </section>
      <section className="hidden md:block">
        <div className="fixed top-8 m-8 flex-col flex">
          <button>영역 1</button>
          <button>영역 1</button>
          <button>영역 1</button>
        </div>
      </section>
    </>
  );
};

export default ResumePage;
