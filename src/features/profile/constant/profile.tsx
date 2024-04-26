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
          isWorking: true,
          role: 'Frontend Developer',
          date: '2024.04 ~ ',
          department: '개발 10 유닛',
          introduction: '',
          link: 'https://www.muhayu.com/',
        },
        projects: [],
      },
    },
    {
      type: 'separate',
      title: '이지일렉트릭',
      items: {
        summary: {
          isWorking: false,
          role: 'Frontend Developer',
          date: '2023.06 ~ 2023.12 (6개월)',
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
          {
            title: '프로젝트 설계',
            list: [
              'React-query를 사용하여 비동기 요청 체계화',
              'Sentry를 활용하여 서비스 장애 추적 및 문제 해결',
              'Atomic Design Pattern에 Compound Component 방식을 도입하여 아키텍처 구조화',
              '크로스 플랫폼 에러를 쉽게 테스트하기 위해 Playwright 도입, Github Action으로 자동 E2E 테스트',
              'JSDoc를 활용하여 함수 및 컴포넌트별로 요구 사항과 설명 작성',
            ],
          },
          {
            title: '마이그레이션',
            list: [
              'React에서 Next.js로 마이그레이션을 하면서 고도화 진행, 기술 스택의 차이 파악',
              '레거시 코드 리팩토링 및 유지보수를 통해 코드량 30% 축소 및 배포 시간 20% 단축',
              '확장성과 재사용성을 고려하여 중복된 스타일링 및 비즈니스 로직을 통일화, 디자인 시스템을 통해 컴포넌트 재설계',
              'Context API를 사용하여 지역적으로 상태를 관리하도록 관심사를 분리',
            ],
          },
          {
            title: '문제 해결',
            list: [
              '토큰 재발급 도중 이전 토큰 사용을 방지하기 위해 request Queue를 도입하여 여러 요청이 문제 없이 처리되도록 구현',
              <>
                배포 환경에서 발생한{' '}
                <a href="https://jaehan.blog/posts/react/Loading-Chunk-Failed-:-청크-로드-에러-해결하기">
                  청크 로드 에러 해결
                </a>
              </>,
              <>
                마이그레이션 페이지를 디버깅하며{' '}
                <a href="https://jaehan.blog/posts/nextjs/Hydration-Error-:-Minified-React-Error-해결하기">
                  Hydration 에러 해결
                </a>
              </>,
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
            'standalone 기반으로 EC2 내에 호스팅한 경험이 있습니다',
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
          list: [
            'Pull Request 이벤트 감지를 통해 다양한 테스트 작업을 자동화할 수 있습니다',
            'Docker 기반과 AWS CodeDeploy 기반의 CI/CD 파이프라인을 구현한 경험이 있습니다',
          ],
        },
        {
          subTitle: 'AWS',
          list: [
            'S3와 CloudFront를 사용하여 정적 파일 캐싱을 통해 로드 속도를 개선한 경험이 있습니다',
            'EC2 인스턴스에서 Docker 기반으로 애플리케이션을 호스팅하고, RDS를 통해 관계형 데이터베이스를 관리할 수 있습니다',
            'CloudWatch를 활용하여 시스템 모니터링 및 로그 수집을 진행하고, SNS 알림을 통해 Slack 자동 메세지 알림 발송을 구현한 경험이 있습니다',
          ],
        },
        {
          subTitle: 'Nginx',
          list: [
            '리버스 프록시를 사용하여 클라이언트 요청을 서버로 라우팅할 수 있습니다',
            'HTTP 444 상태 코드를 활용해 특정 IP 주소나 범위를 차단하여 보안 수준을 높일 수 있습니다',
            '블루-그린 방식의 배포 아키텍쳐를 구현한 경험이 있습니다',
            '라운드-로빈 방식의 로드 밸런싱을 구현할 수 있습니다',
          ],
        },
        {
          subTitle: 'Docker',
          list: [
            'Dockerfile을 작성하는 간단한 문법을 이해하고 있습니다',
            '멀티 스테이지 빌드를 사용하여 단계별로 이미지를 분리하고 빌드 과정을 최적화할 수 있습니다',
            '볼륨 마운트를 통해 호스트와 컨테이너 간에 로그 데이터를 공유한 경험이 있습니다',
          ],
        },
      ],
    },
    {
      type: 'accordion',
      title: 'Server',
      items: [
        {
          subTitle: 'Nest.js',
          list: [
            '간단한 소셜 로그인 및 RESTFul API를 구현한 경험이 있습니다',
            'Repository 패턴 도입 등 관심사를 분리하며 개발합니다',
            '데코레이터를 활용하여 코드의 가독성을 높이고 의존성을 효과적으로 관리합니다',
            '파이프를 통해 커스텀 예외 처리 및 로깅 모듈을 개발한 경험이 있습니다',
          ],
        },
        {
          subTitle: 'Node.js',
          list: [
            'Express를 사용하여 RESTful API를 구현하고, 라우팅 및 미들웨어를 사용한 경험이 있습니다.',
            'Stream을 활용하여 대량의 데이터를 효율적으로 처리할 수 있습니다.',
          ],
        },
      ],
    },
    {
      type: 'accordion',
      title: 'Database',
      items: [
        {
          subTitle: 'MySQL',
          list: [
            'SQL 쿼리문을 작성하는 데 능숙합니다',
            'Nest.js와 MySQL를 연동하여 데이터베이스 작업을 처리한 경험이 있습니다',
            '정규화를 통해 중복 데이터를 최소화하며 데이터 무결성을 보장할 수 있습니다',
          ],
        },
        {
          subTitle: 'prisma',
          list: [
            'Prisma Schema를 활용하여 간단한 데이터베이스 작업을 수행한 경험이 있습니다',
            '외래 키에 대한 유연한 관리와 엔터티 간의 관계 매핑을 쉽게 할 수 있습니다',
          ],
        },
        {
          subTitle: 'Firestore',
          list: [
            'NoSQL 방식의 컬렉션 및 문서 구조를 설계에 능숙합니다',
            'Firebase SDK를 통해 CRUD 기능을 구현한 경험이 있습니다',
          ],
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
          list: [
            'Kinamatic과 Rigidbody를 활용하여 충돌 이벤트를 구현한 경험이 있습니다',
            'Raycast를 활용하여 사용자 상호작용을 구현할 수 있습니다',
            'VR/AR 게임을 제작한 경험이 있습니다',
          ],
        },
        {
          subTitle: 'openCV',
          list: [
            'SURF 알고리즘을 활용하여 특징점을 찾고, Homography 좌표를 통해 이미지 스티칭을 구현할 수 있습니다',
            'Hough Transform을 사용하여 동전 식별 알고리즘을 구현한 경험이 있습니다',
            'Sobel, Canny 등의 알고리즘을 통해 Edge를 추출할 수 있습니다',
          ],
        },
        {
          subTitle: 'openGL',
          list: [
            'Phong Shading을 사용하여 표면의 부드러운 조명 효과를 구현한 경험이 있습니다',
            'Vertex와 Buffer를 활용해 3D 오브젝트의 위치와 형태를 정의할 수 있습니다',
            'Shader를 활용하여 다양한 조명과 색상을 표현할 수 있습니다',
          ],
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
