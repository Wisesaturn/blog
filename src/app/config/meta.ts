import { CATEGORY_DATA } from '@/entities/post';

/** description 이 없는 페이지의 meta description */
export const DEFAULT_DESCRIPTION = `꾸준히 성장하고 싶은 프론트엔드 엔지니어입니다. 저만의 경험과 기록을 담아두었습니다 | Error ${CATEGORY_DATA.map(
  (category) => category.name,
).join(' ')}`;
