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
            <a
              href="https://engineeo.kr"
              target="_blank"
              className="hover:text-blue-700 transition-colors text-[14px] underline"
            >
              https://engineeo.kr/
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-8 max-md:gap-0">
        <div className="max-md:pt-4 max-md:py-2 ml-0.5 pl-7 w-full max-md:mt-2 h-auto">
          <span className="font-bold text-[22px]">서비스 개발</span>
          <ul className="p-0 m-0 pt-2">
            <li>엔지니오 복원 플랫폼 서비스 개발 (Next.js)</li>
            <li>라라라라</li>
            <li>라라라라</li>
            <li>라라라라</li>
            <li>라라라라</li>
          </ul>
        </div>
        <div className="max-md:pt-4 max-md:py-2 ml-0.5 pl-7 w-full max-md:mt-2 h-auto">
          <span className="font-bold text-[22px]">서비스 개발</span>
          <ul className="p-0 m-0 pt-2">
            <li>엔지니오 복원 플랫폼 서비스 개발 (Next.js)</li>
            <li>
              라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라라
            </li>
            <li>라라라라</li>
            <li>라라라라</li>
            <li>라라라라</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
