export interface CategoryType {
  name: string;
  link: string;
}

export const CATEGORY_DATA: CategoryType[] = [
  { name: 'Typescript', link: 'typescript' },
  { name: 'Frontend', link: 'frontend' },
].concat(
  process.env.NODE_ENV === 'development'
    ? [
        { name: '✍️ NEED_글작성', link: 'NEED_글작성' },
        { name: '⚙ LOCAL ⚙', link: 'LOCAL_TEST' },
      ]
    : [],
);
