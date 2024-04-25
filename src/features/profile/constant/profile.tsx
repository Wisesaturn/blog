import { IProfile } from '../types/profile';

const PROFILE: {
  works: IProfile<'separate'>[];
  experiences: IProfile<'default'>[];
  activities: IProfile<'default'>[];
  techStacks: IProfile<'accordion'>[];
  certificates: IProfile<'default'>[];
  awards: IProfile<'default'>[];
  education: IProfile<'default'>[];
} = {
  works: [
    {
      type: 'separate',
      title: '무하유',
      items: {
        summary: {
          role: 'Frontend Developer',
          date: '2024.04 ~ ing',
          department: '개발 10 유닛',
          introduction: '',
          link: 'https://www.muhayu.com/',
        },
        projects: [
          {
            title: '',
            list: [],
          },
        ],
      },
    },
    {
      type: 'separate',
      title: '이지일렉트릭',
      items: {
        summary: {
          role: 'Frontend Developer',
          date: '2023.06 ~ 2023.12',
          department: '개발부',
          introduction: '엔지니오 웹 프론트엔드 서비스 개발, Next.js 마이그레이션 담당',
          link: 'https://engineeo.kr/',
        },
        projects: [
          {
            title: '서비스 개발',
            list: [
              'Next.js 기반 복원 플랫폼 서비스 개발',
              '게시판 에디터 내 AWS S3 이미지 업로드 연동 개발',
              '포인트 충전 기능 구현',
              '어드민 페이지 내 KPI 지표 구현',
            ],
          },
        ],
      },
    },
  ],
  experiences: [
    {
      type: 'default',
      title: '육군사관학교 정보통신대',
      items: {
        badge: '인사행정병',
        list: [
          '엑셀과 VBA를 활용하여 부대 내 근무가용인원을 필터링하여 월별 근무일지 생성 및 수정 기능 개발',
          '매일 2-3시간이 소요되었던 작업을 30분 가량으로 크게 단축',
        ],
      },
    },
  ],
  activities: [
    {
      type: 'default',
      title: 'GDSC',
      items: {
        badge: '교내 활동',
        date: ' 2023.03 ~ 2023.06',
        list: [
          '주도적인 개발 학습에 목표를 두고 참여하였습니다',
          <>
            <a
              target="_blank"
              href="https://gdsc.community.dev/events/details/developer-student-clubs-ajou-university-presents-ajouthon/#0"
              rel="noreferrer"
            >
              해커톤
            </a>{' '}
            참여, UX Flow 및 성능 개선 스터디 진행
          </>,
        ],
      },
    },
    {
      type: 'default',
      title: '모각소',
      items: {
        badge: '스터디',
        date: '2022.07 ~ 2022.08',
        link: 'https://github.com/MogakSo-Ajou/jaehan',
        list: [
          '전반적인 웹 서비스 개념을 공부하기 위해 방학동안 스터디에 참여하였습니다',
          <>
            <a target="_blank" href="https://www.boostcourse.org/web316" rel="noreferrer">
              네이버 부스트코스
            </a>
            를 활용하여 프론트 및 백엔드, 네트워크 학습
          </>,
        ],
      },
    },
    {
      type: 'default',
      title: 'Do-it',
      items: {
        badge: '교내 활동',
        date: '2022.03 ~ 2022.12',
        list: [
          '프론트엔드 실습 및 IT 네트워킹에 참여하기 위해 교네 네트워크 중앙 동아리에 가입하였습니다',
          <>
            React 스터디에 참여 후{' '}
            <a
              target="_blank"
              href="https://www.figma.com/file/T3uO7pOqbH7eILI331dD8N/%EC%9D%B5%EB%AA%85-%EC%9D%B8%EC%8A%A4%ED%83%80%EA%B7%B8%EB%9E%A8?type=design&node-id=0%3A1&mode=design&t=I0bYf5HALVoZ15Dv-1"
              rel="noreferrer"
            >
              인스타그램 코딩 실습
            </a>
          </>,
        ],
      },
    },
  ],
  techStacks: [
    {
      type: 'accordion',
      title: 'Web Development',
      items: [
        {
          subTitle: 'React',
          list: [
            'React와 함께 SPA를 개발할 수 있으며, DOM 조작 및 이벤트 처리에 대한 이해가 있습니다',
            '훅을 활용하여 비즈니스와 UI를 분리하며 개발할 수 있습니다',
            '코드 스플리팅과 메모이제이션을 통해 성능 개선한 경험이 있습니다',
          ],
        },
        {
          subTitle: 'Next.js',
          list: [
            'Page Routing과 App Routing의 장단점을 파악하고 있습니다',
            'SSR과 SSG 환경에 대한 이해가 있습니다',
            'Middleware와 fetch API를 결합하여 사용자 인가 및 인증을 구현한 경험이 있습니다',
          ],
        },
      ],
    },
    {
      type: 'accordion',
      title: 'Test',
      items: [
        {
          subTitle: 'Jest',
          list: [
            'DCI 패턴 기반으로 유닛 테스트를 한 경험이 있습니다',
            'Mocking을 통해 비동기 로직을 테스트 할 수 있습니다',
          ],
        },
        {
          subTitle: 'Playwright',
          list: [
            '사파리와 크로미움 기반 브라우저 간의 차이를 최소화하기 위해 E2E 테스트를 자동화한 경험이 있습니다',
          ],
        },
        {
          subTitle: 'Storybook',
          list: ['CDD 방법론에 익숙합니다', '디자인 시스템을 구축할 때 주로 사용하였습니다'],
        },
      ],
    },
    {
      type: 'accordion',
      title: 'Markup',
      items: [
        {
          subTitle: 'HTML',
          list: [
            '웹 접근성과 SEO를 고려하며 코드를 작성할 수 있습니다',
            '레이아웃 시안을 보고 반응형을 고려하며 빠르게 구현해 낼 수 있습니다',
          ],
        },
        {
          subTitle: 'Markdown',
          list: [
            'README 파일, 블로그 게시물 작성에 익숙합니다',
            'rehype와 remark를 사용하여 mdast를 html로 변환하는 데 능숙합니다',
          ],
        },
        {
          subTitle: 'Katex',
          list: ['간단한 수학 기호와 방정식을 작성할 수 있습니다'],
        },
      ],
    },
    {
      type: 'accordion',
      title: 'DevOps',
      items: [
        {
          subTitle: 'Linux / Ubuntu',
          list: [
            'AWS를 통해 웹 애플리케이션과 서버를 배포한 경험이 있습니다',
            '리눅스 명령어를 사용하여 시스템 관리와 간단한 스크립트 작성을 할 수 있습니다',
          ],
        },
        {
          subTitle: 'Github Actions',
          list: [''],
        },
        {
          subTitle: 'AWS',
          list: [''],
        },
        {
          subTitle: 'Nginx',
          list: [''],
        },
        {
          subTitle: 'Docker',
          list: [''],
        },
      ],
    },
    {
      type: 'accordion',
      title: 'Server',
      items: [
        {
          subTitle: 'Nest.js',
          list: [''],
        },
        {
          subTitle: 'Node.js',
          list: [''],
        },
      ],
    },
    {
      type: 'accordion',
      title: 'Database',
      items: [
        {
          subTitle: 'MySQL',
          list: [''],
        },
        {
          subTitle: 'Firestore',
          list: [''],
        },
      ],
    },
    {
      type: 'accordion',
      title: 'Language',
      items: [
        {
          subTitle: 'Javascript',
          list: [
            'Promise 및 async/await를 활용하여 비동기 코드를 작성할 수 있습니다',
            'ES6 이상의 문법을 활용하여 모듈화된 코드를 작성하고, 클로저 등의 개념을 이해하고 활용할 수 있습니다',
            'History API를 통해 Vanila JS 만으로 간단한 SPA를 구현한 경험이 있습니다',
          ],
        },
        {
          subTitle: 'Typescript',
          list: [
            '타입 가드와 제네릭을 활용하여 안전하게 코드를 작성할 수 있습니다',
            '인터페이스의 상속을 활용하여 타입을 모듈화하고, 타입 추론을 통해 반복적인 타입 선언 없이 코드의 효율성과 가독성을 높일 수 있습니다',
          ],
        },
        {
          subTitle: 'C/C++',
          list: [
            '구조체, 포인터, 레퍼런스 등 C/C++의 핵심 개념을 이해하고 효율적으로 활용할 수 있습니다',
            'new와 delete 명령어를 사용하여 동적 할당과 해제 등 메모리 활용이 가능합니다',
            'STL 자료구조를 적절히 사용할 수 있습니다',
          ],
        },
        {
          subTitle: 'C#',
          list: [
            '유니티의 컴포넌트 기반 구조와 이벤트 시스템을 활용하여 게임 개발 프로세스를 경험하였습니다',
            'OOP를 기반으로 클래스, 객체, 상속, 다형성, 캡슐화 등의 개념을 활용하여 프로그래밍할 수 있습니다',
          ],
        },
        {
          subTitle: 'Java',
          list: [
            '객체 지향 프로그래밍과 SOLID 원칙을 학습하는 용도로 사용하였습니다',
            'Polyline을 통해 소켓 통신을 접한 그림판 에디터를 구현한 경험이 있습니다',
          ],
        },
      ],
    },
    {
      type: 'accordion',
      title: 'Etc',
      items: [
        {
          subTitle: 'Unity',
          list: [''],
        },
        {
          subTitle: 'openCV',
          list: [''],
        },
        {
          subTitle: 'openGL',
          list: [''],
        },
      ],
    },
  ],
  certificates: [
    {
      type: 'default',
      title: 'SQLD',
      items: {
        date: '2024.04.05',
      },
    },
  ],
  awards: [
    {
      type: 'default',
      title: '제 1회 아주톤 우수상',
      items: {
        badge: '해커톤',
        date: '2023.03.19',
      },
    },
  ],
  education: [
    {
      type: 'default',
      title: '아주대학교',
      items: {
        date: '2017.03 ~ 2024.02',
        badge: '디지털미디어학과',
      },
    },
    {
      type: 'default',
      title: '수원고등학교',
      items: {
        date: '2013.03 ~ 2016.02',
      },
    },
  ],
};

export default PROFILE;
