import { type IFireStore } from '@/commons/types/global';

import toSafePathSegment from './toSafePathSegment';

/**
 * @description 문서의 이미지를 올리고 지우는 Storage 폴더 경로를 만든다.
 * `uploadImage` 와 `deleteStore` 가 같이 쓴다. 둘이 다른 폴더를 보면 새 파일이 옛 파일로 지워지거나 옛 파일이 남는다.
 * `title` 은 Firestore 문서 id 로도 쓰는 값이라 그대로 받고, Storage 경로에서만 정리한다 (#131)
 * @param props 컬렉션, 카테고리, `spaceToDash` 를 적용한 제목
 * @returns `collection/category/title` 형식의 폴더 경로
 * @example
 * getStorageFolder({ collection: 'post', category: 'frontend', title: '쌩-npm으로-MFE-구축하기-(1)-:-개념' });
 * // 'post/frontend/쌩-npm으로-MFE-구축하기-1-개념'
 */
export default function getStorageFolder({ collection, category, title }: IFireStore): string {
  return [collection, category, title].map(toSafePathSegment).join('/');
}
