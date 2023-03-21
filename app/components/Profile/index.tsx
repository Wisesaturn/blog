import { AiFillInstagram, AiFillMail, AiFillGithub } from 'react-icons/ai';

import profile from '@public/profile.png';

export default function ProfileSection() {
  const styleIcon =
    'fill-gray-300 hover:fill-green-darker rounded p-1 active:bg-gray-200 duration-200 hover:bg-gray-100';
  const styleIconWrapper =
    'hover:cursor-pointer rounded active:bg-gray-200 duration-200 hover:bg-gray-100';

  return (
    <section className="flex gap-10 w-full py-10 px-10 border-2 border-green-darker shadow-md rounded-xl mb-4">
      <div className="border-2 border-green-darker flex w-20 h-20 md:w-40 md:h-40 overflow-hidden rounded-full shadow-xl">
        <img
          className="translate-y-1/2 w-full h-full object-cover scale-[200%]"
          src={profile}
          alt="프로필"
        />
      </div>
      <div className="flex flex-col gap-2">
        <h1>송재한</h1>
        <p className="text-[18px]">
          안녕하세요! 많은 것을 배우고 싶은 <b className="font-bold">예비 UX 엔지니어</b>
          입니다.
        </p>
        <hr className="my-2" />
        <div className="flex gap-2 w-max">
          <span className={styleIconWrapper}>
            <a
              target="_blank"
              href="mailto:rfv1479@gmail.com?subject=[Blog Contact] "
              rel="noreferrer"
            >
              <AiFillMail className={styleIcon} size="2.25rem" />
            </a>
          </span>
          <span className={styleIconWrapper}>
            <a target="_blank" href="https://www.github.com/wisesaturn" rel="noreferrer">
              <AiFillGithub className={styleIcon} size="2.25rem" />
            </a>
          </span>
          <span className={styleIconWrapper}>
            <a target="_blank" href="https://www.instagram.com/songjh_97" rel="noreferrer">
              <AiFillInstagram className={styleIcon} size="2.25rem" />
            </a>
          </span>
        </div>
      </div>
    </section>
  );
}
