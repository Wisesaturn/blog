import Ping from '@components/Ping';

export default function CompanyTitle({ title }: { title: string }) {
  return (
    <div className="w-full flex h-auto max-md:flex-col mb-8">
      <div className="h-auto">
        <div className="flex items-center">
          <Ping />
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        <div className="py-2 mt-2 sticky ml-0.5 pl-7 border-l-2 h-auto w-60 max-w-60 bg-gray-50 border-green-main max-md:w-screen max-md:max-w-full">
          <p className="p-0 text-[14px]">2023.06 ~ 2023.12</p>
          <p className="p-0 text-[14px]">Frontend Developer</p>
          <p className="p-0 text-[14px]">인턴 / 개발팀</p>
          <div className="py-4" />
          <p className="p-0 text-[14px] text-gray-500">엔지니오 웹 서비스 개발</p>
          <p className="p-0 text-[14px] text-gray-500">Next.js 마이그레이션 주도</p>
          <div className="text-blue-500">
            <a href="https://engineeo.kr" target="_blank" className="text-[14px] link">
              https://engineeo.kr/
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-8 max-md:gap-0 ml-0.5 pl-7 max-md:pl-0">
        {/* 여러 가 생길 경우 map 이용하여 나열 */}
        <div className="max-md:pt-4 max-md:py-2 w-full max-md:mt-2 h-auto">
          <span className="font-bold text-[22px]">서비스 개발</span>
          <ul className="p-0 m-0 pt-2">
            <li>Next.js 기반 복원 플랫폼 서비스 개발</li>
            <li>게시판 에디터 내 AWS S3 이미지 업로드 연동 개발</li>
          </ul>
        </div>
        <div className="max-md:pt-4 max-md:py-2 w-full max-md:mt-2 h-auto">
          <span className="font-bold text-[22px]">프로젝트 설계</span>
          <ul className="p-0 m-0 pt-2">
            <li>React-query를 사용하여 비동기 요청 체계화</li>
            <li>React에서 Next.js로 마이그레이션을 하면서 고도화 진행, 기술 스택의 차이 파악</li>
            <li>
              크로스 플랫폼 에러를 쉽게 테스트하기 위한 Playwright 도입, Github Action 으로 자동 E2E
              테스트
            </li>
            <li>Sentry를 통해 에러 추적 명료화</li>
          </ul>
        </div>
        <div className="max-md:pt-4 max-md:py-2 w-full max-md:mt-2 h-auto">
          <span className="font-bold text-[22px]">문제 해결</span>
          <ul className="p-0 m-0 pt-2">
            <li>
              배포 환경에서 발생한{' '}
              <a
                className="link"
                href="https://jaehan.blog/react/Loading-Chunk-Failed-:-청크-로드-에러-해결하기"
              >
                청크 로드 에러 해결
              </a>
            </li>
            <li>
              마이그레이션 페이지를 디버깅 하며{' '}
              <a
                className="link"
                href="https://jaehan.blog/nextjs/Hydration-Error-:-Minified-React-Error-해결하기"
              >
                Hydration 에러 해결
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
