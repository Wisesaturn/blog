import { IProfile } from '../types/profile';

const PROFILE: {
  works: IProfile<'default'>[];
  experiences: IProfile<'default'>[];
  activities: IProfile<'default'>[];
  techStacks: IProfile<'accordion'>[];
  certificates: IProfile<'default'>[];
  awards: IProfile<'default'>[];
  education: IProfile<'default'>[];
} = {
  works: [],
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
      title: 'Markup',
      items: [
        {
          subTitle: 'HTML',
          list: [''],
        },
        {
          subTitle: 'Markup',
          list: [''],
        },
        {
          subTitle: 'Katex',
          list: [''],
        },
      ],
    },
    {
      type: 'accordion',
      title: 'Styling',
      items: [
        {
          subTitle: 'CSS/SCSS/CSS Module',
          list: [''],
        },
        {
          subTitle: 'TailwindCSS',
          list: [''],
        },
        {
          subTitle: 'Styled-Components',
          list: [''],
        },
        {
          subTitle: 'Emotion',
          list: [''],
        },
      ],
    },
    {
      type: 'accordion',
      title: 'Web Development',
      items: [
        {
          subTitle: 'React',
          list: [''],
        },
        {
          subTitle: 'Next.js',
          list: [''],
        },
        {
          subTitle: 'Remix',
          list: [''],
        },
        {
          subTitle: 'Svelte',
          list: [''],
        },
      ],
    },
    {
      type: 'accordion',
      title: 'State Management',
      items: [
        {
          subTitle: 'Recoil',
          list: [''],
        },
        {
          subTitle: 'Context API',
          list: [''],
        },
        {
          subTitle: 'Redux',
          list: [''],
        },
        {
          subTitle: 'React-Query',
          list: [''],
        },
      ],
    },
    {
      type: 'accordion',
      title: 'DevOps',
      items: [
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
      title: 'Test',
      items: [
        {
          subTitle: 'Jest',
          list: [''],
        },
        {
          subTitle: 'Playwright',
          list: [''],
        },
        {
          subTitle: 'Storybook',
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
      title: 'Graphic',
      items: [
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
    {
      type: 'accordion',
      title: 'Game',
      items: [
        {
          subTitle: 'Unity',
          list: [''],
        },
        {
          subTitle: 'Unreal Game',
          list: [''],
        },
      ],
    },
    {
      type: 'accordion',
      title: 'Collaboration',
      items: [
        {
          subTitle: 'Git & Github',
          list: [''],
        },
        {
          subTitle: 'Notion',
          list: [''],
        },
        {
          subTitle: 'Figma',
          list: [''],
        },
        {
          subTitle: 'Slack',
          list: [''],
        },
        {
          subTitle: 'Jira & Wiki Confluuence',
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
