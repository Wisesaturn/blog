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
  experiences: [],
  activities: [],
  techStacks: [
    {
      type: 'accordion',
      title: 'Language',
      items: {
        list: ['뭘 봐', '네네'],
      },
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
        subTitle: '해커톤',
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
        subTitle: '디지털미디어학과',
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
