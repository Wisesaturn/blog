import { Link } from '@remix-run/react';

export default function ProfileSection() {
  return (
    <section className="flex gap-10 items-center w-full rounded-xl mb-4">
      <div className="flex flex-col gap-2 w-full">
        <h1 className="text-4xl font-bold max-md:text-3xl leading-none my-1">송재한</h1>
        <div className="flex justify-between flex-col">
          <p className="text-base md:text-lg leading-normal p-0">
            꾸준히 성장하고 싶은 프론트엔드 엔지니어입니다.
          </p>
          <p className="text-base md:text-lg leading-normal p-0">
            저만의 경험과 기록을 담아두었습니다
          </p>
          <span className="text-gray-500 flex items-end hover:text-green-main w-max transition-colors py-2">
            <Link reloadDocument to="/resume" className="w-max">
              저에 대해서 궁금하시다면?
            </Link>
          </span>
        </div>
      </div>
    </section>
  );
}
