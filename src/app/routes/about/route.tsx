import { MetaFunction } from 'react-router';

import { AboutPage } from '@/pages/about';

import formatHeadTags from '../../lib/formatHeadTags';

// meta
export const meta: MetaFunction = (args) => {
  const urlPrefix = 'about';
  const title = '프론트엔드 개발자 송재한입니다';
  return formatHeadTags({ urlPrefix, title, ...args });
};

export default AboutPage;
