import profile from '@public/profile-real.webp';

export default function MainProfile() {
  return (
    <section className="flex md:flex-row md:gap-0 gap-5 flex-col items-center justify-center md:space-x-10 w-full pb-16">
      <img
        className="animate-skeletonUI inline-block min-w-[15rem] w-60 h-60 object-cover rounded-full"
        src={profile}
        alt="프로필 사진"
      />
      <div className="text-justify leading-loose">
        <span className="block pb-4">
          <strong className="block text-3xl">송재한</strong>
          <p className="block text-xl">Frontend Developer</p>
        </span>
        <p className="before:content-['💬'] before:pr-2">
          <strong>UX 이론</strong>과 <strong>클린 코딩</strong>에 관심이 많습니다.
        </p>
        <p className="before:content-['💬'] before:pr-2">
          <strong>깔끔한 인터페이스</strong>와 <strong>애니메이션</strong>을 구현하는 것을
          좋아합니다.
        </p>
        <p className="before:content-['💬'] before:pr-2">
          서비스의 가치는 <strong>피드백</strong>으로부터 나온다고 믿습니다.
        </p>
      </div>
    </section>
  );
}
