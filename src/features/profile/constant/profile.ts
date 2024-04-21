import { IProfile } from '../types/profile';

const PROFILE: { [key in string]: IProfile[] } = {
  works: [],
  experiences: [],
  activities: [],
  techStacks: [
    {
      title: 'Language',
      list: ['뭘 봐', '네네'],
    },
  ],
  certificates: [
    {
      title: 'SQLD',
      date: '2024.04.05',
    },
  ],
  awards: [{ title: '제 1회 아주톤 우수상', subTitle: '해커톤', date: '2023.03.19' }],
  education: [
    {
      title: '아주대학교',
      date: '2017.03 ~ 2024.02',
      subTitle: '디지털미디어학과',
    },
    {
      title: '수원고등학교',
      date: '2013.03 ~ 2016.02',
    },
  ],
};

export default PROFILE;
