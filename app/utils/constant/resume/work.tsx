import { ProjectItem } from '@Types/resume';

export const WORK_이지일렉트릭: ProjectItem = {
  info: {
    teamName: '이지일렉트릭',
    date: '2023.06 ~ 2023.12',
    role: 'Frontend Developer',
    position: '인턴 / 개발팀',
    description: ['엔지니오 웹 서비스 개발', 'Next.js 마이그레이션 주도'],
    link: 'https://engineeo.kr',
  },
  content: [
    {
      title: '서비스 개발',
      list: [
        'Next.js 기반 복원 플랫폼 서비스 개발',
        '게시판 에디터 내 AWS S3 이미지 업로드 연동 개발',
      ],
    },
    {
      title: '프로젝트 설계',
      list: [
        'React-query를 사용하여 비동기 요청 체계화',
        'React에서 Next.js로 마이그레이션을 하면서 고도화 진행, 기술 스택의 차이 파악',
        '크로스 플랫폼 에러를 쉽게 테스트하기 위한 Playwright 도입, Github Action 으로 자동 E2E 테스트',
        'Sentry를 활용하여 서비스 장애 추적 및 문제 해결',
      ],
    },
    {
      title: '문제 해결',
      list: [
        '토큰 재발급 도중 이전 토큰 사용을 방지하기 위해 request Queue를 도입하여 여러 요청이 문제 없이 처리되도록 구현',
        <>
          배포 환경에서 발생한{' '}
          <a
            className="link"
            href="https://jaehan.blog/react/Loading-Chunk-Failed-:-청크-로드-에러-해결하기"
          >
            청크 로드 에러 해결
          </a>
        </>,
        <>
          마이그레이션 페이지를 디버깅 하며{' '}
          <a
            className="link"
            href="https://jaehan.blog/nextjs/Hydration-Error-:-Minified-React-Error-해결하기"
          >
            Hydration 에러 해결
          </a>
        </>,
      ],
    },
  ],
};
