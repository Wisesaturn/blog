import { ProjectItem } from '@Types/resume';
import Thumbnail푸드모아2023 from '@public/thumbnail/project/푸드모아2023.png';
import ThumbnailBlog from '@public/thumbnail.webp';

export const PERSONALPROJECT_푸드모아: ProjectItem = {
  info: {
    teamName: '푸드모아 2023',
    date: '2023.11.01 ~ 2023.11.20',
    techStack: ['Svelte', 'Javascript', 'Notion'],
    description: [
      '방방곡곡 2023년에 맛집과 카페를 다니며 남긴 리뷰를 통해 한 해를 돌아보는 페이지를 제작해보았습니다',
    ],
    link: 'https://wisesaturn.github.io/FoodMoa2023',
    linkAlt: '홈페이지',
    thumbnail: Thumbnail푸드모아2023,
  },
  content: [
    {
      title: '프로젝트 설계',
      list: [
        'SSG 방식으로 build 파일 내에 데이터를 담아 구현',
        'Notion API를 활용하여 데이터 로드',
        '각 테마별 데이터를 파싱해주도록 함수 구현',
      ],
    },
  ],
};

export const PERSONALPROJECT_블로그: ProjectItem = {
  info: {
    teamName: '블로그',
    date: '2022.10 ~ 진행 중',
    techStack: ['Remix', 'Typescript', 'Notion', 'Firebase'],
    description: [
      'Remix를 기반으로 한 개인 블로그를 제작하였습니다',
      'Notion에 블로그 게시물을 저장해두어 간편하게 글 작성 및 배포를 할 수 있도록 만들었습니다',
    ],
    link: 'https://github.com/Wisesaturn/blog',
    linkAlt: '블로그 깃허브',
    thumbnail: ThumbnailBlog,
  },
  content: [
    {
      title: '프로젝트 설계',
      list: [
        'Notion API를 활용하여 게시물 CRUD 구현',
        'Remix에선 SSR 방식만 지원하므로 간헐적으로 느린 Notion API 응답 속도를 개선하기 위해 Firestore에 데이터를 저장하여 CDN 역할로 사용',
        '무분별한 데이터 요청을 방지하도록 Cache-Control 설정',
        'Client단 Data Fetching을 위해 Context API를 이용하여 환경 변수를 서버단에서 내려받을 수 있도록 구현',
        'Prefetch를 통해 필요한 리소스를 먼저 로딩하여 사용자 경험 개선',
        <>
          <code>serverDependenciesToBundle</code>을 추가하여&nbsp;
          <a
            className="link"
            href="https://remix.run/docs/en/main/file-conventions/remix-config#serverdependenciestobundle"
          >
            ESM-Only Module 문제를 해결
          </a>
        </>,
      ],
    },
  ],
};
