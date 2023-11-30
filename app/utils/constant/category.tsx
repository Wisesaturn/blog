import React from 'react';

import IconTypescript from '@components/Assets/IconTypescript';
import IconReact from '@components/Assets/IconReact';
import IconNext from '@components/Assets/IconNext';

export interface CategoryType {
  name: string;
  link: string;
  color?: string;
  icon?: React.ReactElement;
}

export const PRODUCTION_CATEGORY_DATA: CategoryType[] = [
  { name: 'Typescript', link: 'typescript', color: '#3178c6', icon: <IconTypescript /> },
  { name: 'Frontend', link: 'frontend' },
  { name: 'React', link: 'react', color: '#00d8ff', icon: <IconReact /> },
  { name: 'Next.js', link: 'nextjs', color: '#000000', icon: <IconNext /> },
];

export const CATEGORY_DATA: CategoryType[] = PRODUCTION_CATEGORY_DATA.concat(
  process.env.NODE_ENV === 'development'
    ? [
        { name: '✍️ NEED_글작성', link: 'LOCAL_WRITING' },
        { name: '⚙ LOCAL ⚙', link: 'LOCAL_TEST' },
      ]
    : [],
);
