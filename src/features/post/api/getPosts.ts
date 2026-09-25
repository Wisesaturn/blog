import { collection, getDocs } from 'firebase/firestore';

import { CATEGORY_DATA } from '@/shared/constant/category';

import { type IPost } from '@/features/post/types/post';
import { postListItem } from '@/features/post/model/postDocument';

import { db } from '@/commons/api/firebase';
import { parseDocuments } from '@/commons/lib/firestoreDocument';

/**
 * @description 모든 카테고리의 글 목록을 본문 없이 조회한다
 * @returns 본문을 뺀 글 목록. 순서는 정하지 않는다
 *
 * 검색과 카테고리 필터, 정렬은 여기서 하지 않고 목록 페이지가 `filterPosts` 로 한다.
 * loader 가 쿼리스트링을 읽지 않아야 목록 응답이 한 벌로 캐시되기 때문이다.
 *
 * 컬렉션에 `plain_title` 없이 `reactions` 만 있는 유령 문서가 있어 스키마 검사로 건너뛴다.
 * 건너뛰지 않으면 목록에 제목 없는 행으로 나오고, 검색에서 `plain_title` 을 읽다가 멈춘다.
 */
export default async function getPosts(): Promise<Omit<IPost, 'body'>[]> {
  const perCategory = await Promise.all(
    CATEGORY_DATA.map(async (category) => {
      const snapshot = await getDocs(collection(db, category.link));
      return parseDocuments(postListItem, snapshot.docs);
    }),
  );

  return perCategory.flat();
}
