import { IProfile } from '../types/profile';

const PROFILE: { [key in string]: IProfile[] } = {
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
