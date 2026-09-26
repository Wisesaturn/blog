import { APP_VERSION, RELEASE_URL } from '@/commons/config/site';

import Contact from './Contact';

export default function Copyright() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-xs md:text-sm flex justify-center flex-col items-center bg-gray-100 dark:bg-[#191919] mt-10 py-6 gap-1">
      {/* 모바일 하단 내비게이션용 여백(아래 div)을 빼고 배치하려고 내용만 감싼 기준 상자 */}
      <div className="relative flex w-full flex-col items-center gap-1">
        <Contact />
        <span className="text-gray-400 dark:text-gray-200">
          © 2023-{currentYear} Copyright{' '}
          <span className="text-gray-500 dark:text-white">사툰사툰</span>, based on{' '}
          <span className="text-gray-500 dark:text-white">React Router</span>
        </span>
        {/* 모바일은 Copyright 줄이 화면 폭을 거의 다 써서, 겹치지 않는 아이콘 줄 높이에 둔다 */}
        <a
          href={`${RELEASE_URL}/tag/v${APP_VERSION}`}
          target="_blank"
          rel="noreferrer"
          aria-label={`버전 ${APP_VERSION} 릴리즈 노트`}
          className="absolute left-4 top-3 md:left-6 md:top-auto md:bottom-0.5 text-[10px] md:text-xs tracking-[0.12em] text-gray-300 transition-colors hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-300"
        >
          v{APP_VERSION}
        </a>
      </div>
      <div className="max-md:min-h-[44px] ios-notch-margin-bottom hidden max-md:block" />
    </footer>
  );
}
