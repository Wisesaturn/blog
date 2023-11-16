import { TextItem } from '@Types/resume';
import ThumbnailGDSC from '@public/thumbnail/activities/GDSC.png';
import Thumbnail모각소 from '@public/thumbnail/activities/모각소.jpg';
import Thumbnail두잇 from '@public/thumbnail/activities/Do-it.png';

export const ACTIVITY_GDSC: TextItem = {
  title: 'GDSC',
  position: '교내/교외 활동',
  date: '2023.03 ~ 2023.08',
  thumbnail: ThumbnailGDSC,
  tasks: [
    '주도적인 개발 학습에 목표를 두고 참여하였습니다.',
    <>
      <a
        className="link"
        href="https://gdsc.community.dev/events/details/developer-student-clubs-ajou-university-presents-ajouthon/#0"
      >
        해커톤
      </a>
      &nbsp;참여, UX Flow 및 성능 개선 스터디
    </>,
  ],
};

export const ACTIVITY_모각소: TextItem = {
  title: '모각소',
  position: '스터디',
  link: 'https://github.com/MogakSo-Ajou/jaehan',
  thumbnail: Thumbnail모각소,
  tasks: [
    '전반적인 웹 서비스 개념을 공부하기 위해 방학 내에 진행하였습니다.',
    '네이버 부스트코스를 활용하여 프론트 및 백엔드, 네트워크 학습',
  ],
};

export const ACTIVITY_두잇: TextItem = {
  title: 'Do-it',
  position: '교내 활동',
  date: '2022.03 ~ 2022.12',
  thumbnail: Thumbnail두잇,
  tasks: [
    '프론트엔드 실습을 하기 위해 교내 네트워크 중앙 동아리에 가입하였습니다.',
    <>
      React 스터디 참여 후{' '}
      <a
        className="link"
        href="https://www.figma.com/file/T3uO7pOqbH7eILI331dD8N/%EC%9D%B5%EB%AA%85-%EC%9D%B8%EC%8A%A4%ED%83%80%EA%B7%B8%EB%9E%A8?type=design&node-id=0%3A1&mode=design&t=I0bYf5HALVoZ15Dv-1"
      >
        인스타그램 클론코딩 실습
      </a>
    </>,
  ],
};
