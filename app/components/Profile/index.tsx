import { AiFillInstagram, AiFillMail, AiFillGithub } from 'react-icons/ai';

import profile from '@public/profile.png';
import { TWstyleIcon, TWstyleIconWrapper } from '@styles/config';

export default function ProfileSection() {
  return (
    <section className="flex flex-col gap-10 items-center w-full py-10 px-10 border-2 r shadow-md rounded-xl mb-4">
      <div className="items-center bg-green-main flex w-40 h-40 overflow-hidden rounded-full shadow-xl">
        <img
          className="translate-y-1/2 w-full h-full object-cover scale-[200%]"
          src={profile}
          alt="프로필"
        />
      </div>
      <div className="flex flex-col gap-2">
        <h1>송재한</h1>
        <p className="text-[16px] md:text-[18px] leading-8">
          안녕하세요! 깔끔한 애니메이션을 구현하는 걸 좋아하는{' '}
          <b className="font-bold">예비 프론트엔드 엔지니어</b>
          입니다.
          <br />
          UX 이론과 클린 코딩에 관심이 많아요!
        </p>
        <hr className="my-2" />
        <div className="flex gap-2 w-max">
          <span className={TWstyleIconWrapper}>
            <a
              target="_blank"
              href="mailto:rfv1479@gmail.com?subject=[Blog Contact] "
              rel="noreferrer"
            >
              <AiFillMail className={TWstyleIcon} size="2.25rem" />
            </a>
          </span>
          <span className={TWstyleIconWrapper}>
            <a target="_blank" href="https://www.github.com/wisesaturn" rel="noreferrer">
              <AiFillGithub className={TWstyleIcon} size="2.25rem" />
            </a>
          </span>
          <span className={TWstyleIconWrapper}>
            <a target="_blank" href="https://www.instagram.com/songjh_97" rel="noreferrer">
              <AiFillInstagram className={TWstyleIcon} size="2.25rem" />
            </a>
          </span>
        </div>
      </div>
    </section>
  );
}
