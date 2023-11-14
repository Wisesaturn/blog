import { ProjectItem } from '@Types/resume';

export const TEAMPROJECT_아주그라운드: ProjectItem = {
  info: {
    teamName: '아주그라운드',
    date: '2023.03.18 ~ 2023.03.19',
    role: 'Frontend & UI Developer',
    position: '팀장 [4명]',
    description: [
      '이틀동안 주어진 주제에 따라 사회 발전에 기여할 수 있는 Web 또는 Mobile App을 만드는 것을 목표로 하는 교내 1박 2일 해커톤에 참여하였습니다',
    ],
    link: 'https://github.com/AJOUChakra7/ajou-ground',
    linkAlt: '아주그라운드 깃허브',
    isAwarded: true,
  },
  content: [
    {
      title: '서비스 개발',
      list: [
        <>
          <code>{`<dialog>`}</code>를 사용한 모달 컴포넌트 개발
        </>,
        'React Portal을 사용하여 토스트 컴포넌트 개발',
        '로딩 상태를 표시하기 위한 스피너 추가',
        '로그인 화면 개발',
      ],
    },
    {
      title: '디자인',
      list: ['Figma를 사용하여 UI 디자인 시안 및 UX 플로우 제작'],
    },
  ],
};

export const TEAMPROJECT_언더바: ProjectItem = {
  info: {
    teamName: '언더바',
    date: '2022.09 ~ 2022.12',
    role: 'Frontend Developer',
    position: '팀장 [3명]',
    description: [
      '졸업프로젝트로 시작하였으며, 학과별 정보 공유 및 익명성 커뮤니티 서비스 출시를 목표로 하였습니다.',
      '기획부터 개발, 배포, 운영까지 전반적인 플랫폼 운영 방식을 경험해보았습니다.',
    ],
    link: 'https://github.com/MP-2022-2/FE-newMIL',
    linkAlt: '언더바 깃허브',
  },
  content: [
    {
      title: '서비스 개발',
      list: [
        '서비스 메인 페이지 개발',
        '학생별로 열람할 수 있는 게시판 개발',
        '이메일 인증 방식을 도입한 로그인 및 회원가입 개발',
        '내 정보 페이지 개발',
      ],
    },
    {
      title: '프로젝트 설계',
      list: [
        'lazy와 suspense를 활용해 Lazy Loading 기법을 도입하여 이미지 로딩 속도 개선',
        'JWT 토큰을 활용한 회원 인증',
        'nginx를 활용하여 Blue/Green 방식의 무중단 배포 구현',
        '네트워크 에러 발생 시 정해진 횟수만큼 재시도 하도록 axios interceptor를 통해 네트워크 요청 모듈화',
        'Github Actions를 활용하여 CI/CD 자동화',
        'react-hook-form을 사용하여 쉽게 input 및 form 태그 상태 관리',
      ],
    },
  ],
};
