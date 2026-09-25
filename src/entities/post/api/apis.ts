import { collection, doc, getDoc, getDocs, increment, setDoc, updateDoc } from 'firebase/firestore';

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

  return parseDocument(postDocument, docSnap);
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
      return parseDocuments(postListItem, snapshot.docs);
    }),
  );

  return perCategory.flat();
}

interface IncreasePostViewsProps {
  category: string;
  title: string;
}

/**
 * @description 글 조회수를 1 올리고, 올린 뒤의 값을 돌려준다
 *
 * `views: 읽은 값 + 1` 로 쓰면 동시에 들어온 요청끼리 서로 덮어써서 조회수가 빠진다.
 * `increment()` 는 Firestore 가 서버에서 더하므로 빠지지 않는다.
 *
 * 문서가 없으면 `updateDoc` 이 실패한다. 공개 API 에서 부르는 함수라 없는 문서를 새로 만들지 않는다.
 * @param props.category 컬렉션 이름
 * @param props.title 문서 id. URL 의 제목 그대로다
 * @returns 올린 뒤의 조회수
 * @throws 문서가 없으면 에러가 발생한다
 */
export async function increasePostViews({
  category,
  title,
}: IncreasePostViewsProps): Promise<number> {
  const docRef = doc(db, category, title);
  await updateDoc(docRef, { views: increment(1) });
  const snap = await getDoc(docRef);
  return snap.data()?.views ?? 0;
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
      const updatedData = isUpdatePost
        ? { ...data, views: docSnap.data().views || data.views }
        : data;
      await updateDoc(docRef, updatedData);
    } else {
      await setDoc(docRef, data);
    }

    if (isUpdatePost) {
      Logger.success(`${category}/${title}에 게시물을 업데이트하였습니다.`);
    } else {
      Logger.log(`${title} views update : ${data.views}`);
    }
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
