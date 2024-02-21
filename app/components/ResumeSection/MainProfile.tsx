import React from 'react';

import profile from '@public/profile-real.webp';

import Contact from './Contact';

function MainProfile() {
  const IntroduceSetences = [
    <>
      모두가 편할 수 있도록 끊임없이 <strong>개선</strong>합니다.
    </>,
    <>
      <b>UX 이론</b>과 <b>클린 코딩</b>에 대해 관심이 많습니다.
    </>,
    <>
      사용한 기술을 <strong>왜 사용하는지</strong>에 대해 꾸준히 고민합니다.
    </>,
    <>
      팀원 간 <strong>커뮤니케이션을 중시</strong>하며 테스트 코드를 작성하고 문서화합니다.
    </>,
    <>
      트러블 슈팅 중 맞닥뜨린 <b>이슈와 실패 원인을 분명하게 파악</b>할 수 있도록 <b>글을 작성</b>
      하며 개념 정의를 명료화 합니다.
    </>,
  ];

  return (
    <>
      <div className="max-md:flex-col flex items-center justify-center md:space-x-10 w-full pb-6 max-mad:pb-0">
        <img
          className="animate-skeletonUI inline-block min-w-[15rem] w-60 h-60 object-cover rounded-full"
          src={profile}
          alt="프로필 사진"
        />
        <div className="text-justify leading-loose">
          <span className="block py-4">
            <strong className="block text-3xl">송재한</strong>
            <p className="block text-xl">Frontend Developer</p>
            <Contact />
          </span>
          {IntroduceSetences.map((item, idx) => (
            <p key={idx} className="before:content-['💬'] before:pr-2 inline-block max-md:text-sm">
              {item}
            </p>
          ))}
        </div>
      </div>
      {/* Thumbnail Observer용 (프로필에선 Thumbnail 안 나오게) */}
      <h3 id="" />
    </>
  );
}

export default React.memo(MainProfile);
