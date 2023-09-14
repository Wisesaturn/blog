export interface CategoryType {
  name: string;
  link: string;
}

export const CATEGORY_DATA: CategoryType[] = [
  { name: 'Typescript', link: 'typescript' },
  { name: 'Frontend', link: 'frontend' },
  { name: 'React', link: 'react' },
].concat(
  process.env.NODE_ENV === 'development'
    ? [
        { name: '✍️ NEED_글작성', link: 'LOCAL_WRITING' },
        { name: '⚙ LOCAL ⚙', link: 'LOCAL_TEST' },
      ]
    : [],
);
