export interface CategoryType {
  name: string;
  link: string;
}

export const CATEGORY_DATA: CategoryType[] = [{ name: '⚙ ETC', link: 'etc' }].concat(
  process.env.NODE_ENV === 'development' ? [{ name: '로컬 테스트 환경', link: 'NEED_글작성' }] : [],
);
