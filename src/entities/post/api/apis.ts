import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';

import { db } from '@/commons/api/firebase.server';
import { parseDocument, parseDocuments } from '@/commons/lib/firestoreDocument';
import Logger from '@/commons/lib/logger';

import { CATEGORY_DATA } from '../config/category';
import { postDocument, postListItem } from '../model/postDocument';
import { type IPost } from './types';

interface GetPostProps {
  category: string;
  title: string;
}

export async function getPost(props: GetPostProps) {
  const { category, title } = props;
  const docRef = doc(db, category, title);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    const NotFoundError = new Error(`${category}/${title}에 해당하는 게시물이 없습니다`);
    Logger.error(NotFoundError);
    throw NotFoundError;
  }

  return parseDocument({ schema: postDocument, doc: docSnap });
}

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
export async function getPosts(): Promise<Omit<IPost, 'body'>[]> {
  const perCategory = await Promise.all(
    CATEGORY_DATA.map(async (category) => {
      const snapshot = await getDocs(collection(db, category.link));
      return parseDocuments({ schema: postListItem, docs: snapshot.docs });
    }),
  );

  return perCategory.flat();
}

interface UpdatePostProps {
  category: string;
  title: string;
  data: Partial<IPost>;
  isUpdatePost?: boolean;
}

export async function updatePost(props: UpdatePostProps) {
  const { category, title, data, isUpdatePost = false } = props;
  try {
    const docRef = doc(db, category, title);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // 조회수와 좋아요는 stats 문서에 있다 (#117). 본문 문서만 덮어쓴다
      await updateDoc(docRef, data);
    } else {
      await setDoc(docRef, data);
    }

    if (isUpdatePost) Logger.success(`${category}/${title}에 게시물을 업데이트하였습니다.`);
  } catch (err) {
    if (err instanceof Error) {
      const NotFoundError = new Error(`${category}/${title}에 해당하는 게시물이 없습니다`, {
        cause: err,
      });
      Logger.error(NotFoundError);
      throw NotFoundError;
    }
    throw err;
  }
}
