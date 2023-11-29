export interface CategoryType {
  name: string;
  link: string;
  color?: string;
  icon?: string;
}

export const PRODUCTION_CATEGORY_DATA: CategoryType[] = [
  { name: 'Typescript', link: 'typescript', color: '#3178c6', icon: 'akar-icons:typescript-fill' },
  { name: 'Frontend', link: 'frontend' },
  { name: 'React', link: 'react', color: '#00d8ff', icon: 'mdi:react' },
  { name: 'Next.js', link: 'nextjs', color: '#000000', icon: 'akar-icons:nextjs-fill' },
];

export const CATEGORY_DATA: CategoryType[] = PRODUCTION_CATEGORY_DATA.concat(
  process.env.NODE_ENV === 'development'
    ? [
        { name: '✍️ NEED_글작성', link: 'LOCAL_WRITING' },
        { name: '⚙ LOCAL ⚙', link: 'LOCAL_TEST' },
      ]
    : [],
);
