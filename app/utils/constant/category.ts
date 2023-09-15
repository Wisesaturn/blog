export interface CategoryType {
  name: string;
  link: string;
  color?: string;
  icon?: string;
}

export const CATEGORY_DATA: CategoryType[] = [
  { name: 'Typescript', link: 'typescript', color: '#3178c6', icon: 'akar-icons:typescript-fill' },
  { name: 'Frontend', link: 'frontend' },
  { name: 'React', link: 'react', color: '#00d8ff', icon: 'mdi:react' },
].concat(
  process.env.NODE_ENV === 'development'
    ? [
        { name: '✍️ NEED_글작성', link: 'LOCAL_WRITING' },
        { name: '⚙ LOCAL ⚙', link: 'LOCAL_TEST' },
      ]
    : [],
);
