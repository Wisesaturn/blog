export interface ICategory {
  name: string;
  link: string;
}

export const PRODUCTION_CATEGORY_DATA: ICategory[] = [
  { name: 'Typescript', link: 'typescript' },
  { name: 'Frontend', link: 'frontend' },
  { name: 'React', link: 'react' },
  { name: 'Next.js', link: 'nextjs' },
];

export const CATEGORY_DATA: ICategory[] = PRODUCTION_CATEGORY_DATA.concat(
  process.env.NODE_ENV === 'development'
    ? [
        { name: '✍️ NEED_글작성', link: 'LOCAL_WRITING' },
        { name: '⚙ LOCAL ⚙', link: 'LOCAL_TEST' },
      ]
    : [],
);

export const PROJECTS_DATA: ICategory[] = [
  // TODO : Projects 업데이트 해야 함
  // { name: 'GOTCHA', link: 'GOTCHA' },
  // { name: '브이토피아', link: '브이토피아' },
  // { name: '아주그라운드', link: '아주그라운드' },
  // { name: '언더바', link: '언더바' },
  // { name: '펫탈로그', link: '펫탈로그' },
  { name: '유클러버스', link: '유클러버스' },
];
