import React from 'react';

export interface ICategory {
  name: string;
  link: string;
  color?: string;
  icon?: React.ReactElement;
}

export const PRODUCTION_CATEGORY_DATA: ICategory[] = [
  { name: 'Typescript', link: 'typescript', color: '#3178c6' },
  { name: 'Frontend', link: 'frontend' },
  { name: 'React', link: 'react', color: '#00d8ff' },
  { name: 'Next.js', link: 'nextjs', color: '#000000' },
];

export const CATEGORY_DATA: ICategory[] = PRODUCTION_CATEGORY_DATA.concat(
  process.env.NODE_ENV === 'development'
    ? [
        { name: '✍️ NEED_글작성', link: 'LOCAL_WRITING' },
        { name: '⚙ LOCAL ⚙', link: 'LOCAL_TEST' },
      ]
    : [],
);
