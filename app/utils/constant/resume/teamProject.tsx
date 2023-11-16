import { ProjectItem } from '@Types/resume';

export const TEAMPROJECT_아주그라운드: ProjectItem = {
  info: {
    teamName: '아주그라운드',
    date: '2023.03.18 ~ 2023.03.19',
    role: 'Frontend & UI Developer',
    position: '팀장 [4명]',
    techStack: ['Next.js', 'Javascript', 'TailwindCSS'],
    description: [
      '이틀동안 주어진 주제에 따라 사회 발전에 기여할 수 있는 Web 또는 Mobile App을 만드는 것을 목표로 하는 교내 해커톤에 참여하였습니다',
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
    techStack: ['React', 'Typescript', 'Styled-Components', 'Recoil'],
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

export const TEAMPROJECT_펫탈로그: ProjectItem = {
  info: {
    teamName: '펫탈로그',
    date: '2022.07 ~ 2022.12',
    role: 'UI Developer',
    position: '팀원 [4명]',
    techStack: ['React', 'Typescript', 'Redux', 'TailwindCSS', 'Lottie'],
    description: [
      '각자 개성이 넘치는 사랑스러운 반려견에게 맞춤 정보를 제공해드립니다!',
      '반려견을 위한 사료 추천 및 건강 관리 애플리케이션을 개발하였습니다.',
    ],
    link: 'https://github.com/PinkDumbbell/CocoBob-FE',
    linkAlt: '펫탈로그 깃허브',
  },
  content: [
    {
      title: '서비스 개발',
      list: ['서비스 랜딩 페이지 개발'],
    },
    {
      title: '프로젝트 설계',
      list: [
        <>
          UI/UX 디자인 일관성을 높이기 위해 자체{' '}
          <a
            className="link"
            href="https://www.figma.com/file/g3XuRlHsew0qauASvFPmER/Style-Guide?node-id=815%3A4716&t=sGvEwNgBZjK6NHQM-1&fuid=1092707171298235723"
          >
            디자인 시스템 설계
          </a>
        </>,
        'TailwindCSS 디자인 시스템에 맞게 명료화',
        '웹 접근성을 고려한 시맨틱 태그 및 대체 텍스트 사용',
        'Intersection Observer를 활용한 슬라이딩 애니메이션 구현',
        'Lottie를 활용하여 기존 방법 대비 리소스 용량을 약 3-4MB에서 200KB 이내로 축소',
      ],
    },
  ],
};

export const TEAMPROJECT_브이토피아: ProjectItem = {
  info: {
    teamName: '브이토피아',
    date: '2023.03 ~ 2023.06',
    role: 'Frontend Developer',
    position: '팀원 / 개발팀 [2명]',
    techStack: ['Javascript', 'Jest', 'SCSS'],
    description: ['버추얼 아티스트를 만들고 관리해주는 매니지먼트 프로젝트에 참여하였습니다'],
    link: 'https://github.com/Wisesaturn/V-Topia',
    linkAlt: '브이토피아 깃허브',
  },
  content: [
    {
      title: '서비스 개발',
      list: ['브이토피아를 소개하는 회사 매니지먼트 페이지 개발'],
    },
    {
      title: '프로젝트 설계',
      list: ['Vanila JS를 통해 SPA 구현', 'Jest를 사용하여 유닛 테스트 진행'],
    },
  ],
};

export const TEAMPROJECT_유클러버스: ProjectItem = {
  info: {
    teamName: '유클러버스',
    date: '2022.03 ~ 2022.06',
    role: 'Frontend Developer & UI/UX Designer',
    position: '팀원 [5명]',
    techStack: ['React', 'Typescript', 'Recoil', 'Styled-Components'],
    description: [
      '팬데믹으로 인한 비대면의 불편함 해소를 위해 동아리 커뮤니티 서비스를 제작하였습니다.',
      '비대면 소학회 및 동아리 간접경험과 홍보/신청이란 도전과제를 목표를 두었습니다',
    ],
    link: 'https://github.com/taehong0-0/Ucluverse',
    linkAlt: '유클러버스 깃허브',
  },
  content: [
    {
      title: '서비스 개발',
      list: [
        '서비스 랜딩 페이지 개발 (UI)',
        '디자인 및 마크업 등 퍼블리싱 작업',
        '벡터 이미지 내 CSS을 통해 애니메이션 구현',
      ],
    },
    {
      title: '프로젝트 운영',
      list: ['Notion을 통해 주차별 회의 진행 및 프로젝트 상황 공유'],
    },
    {
      title: '디자인',
      list: ['Adobe XD를 통해 UI/UX 디자인 작업', 'After Effects를 통해 애니메이션 작업'],
    },
  ],
};

export const TEAMPROJECT_GOTCHA: ProjectItem = {
  info: {
    teamName: 'GOTCHA',
    date: '2022.03 ~ 2022.06',
    role: 'Client Developer',
    position: '팀원 [4명]',
    techStack: ['Unity', 'C#'],
    description: [
      '몰입형 미디어 프로그래밍이라는 전공 수업 과정에서 Unity를 활용해 VR 및 AR 게임을 제작하였습니다',
      '일상에 모기가 많아진 이유를 알아내기 위해 모기 군단을 퇴치하며 실마리를 파헤치는 이야기입니다.',
    ],
    link: 'https://github.com/IMP-2022-1',
    linkAlt: 'Gotcha 깃허브',
  },
  content: [
    {
      title: '클라이언트 개발 (AR)',
      list: [
        '게임 오버 및 타이머 등 게임 매니저 설계',
        '체력 감소, 공격 이펙트, 체력 바, 타이머 등 전반적인 게임 UI 디자인',
        '모기에게 대항할 때 필요한 조건별 비즈니스 로직 구현',
        '사운드 효과음 및 게임 화면 UX 개선',
      ],
    },
    {
      title: '클라이언트 개발 (VR)',
      list: [
        '실험실 내 퍼즐 문제 제작',
        'Raycast를 활용하여 실험실 내 상호작용 구현',
        '플레이어의 좌표를 확인하여 특정 장소에 가면 TV가 자동 재생 되도록 구현',
        'Kinamatic과 Rigidbody를 활용하여 상자 속에 아이템을 찾도록 충돌 이벤트 구현',
      ],
    },
    {
      title: '프로젝트 운영',
      list: ['게임 소개 트레일러 제작', '일정 및 문서 관리'],
    },
  ],
};
