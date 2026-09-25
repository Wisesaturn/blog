import { collection, doc, getDoc, getDocs, increment, setDoc, updateDoc } from 'firebase/firestore';

import { db } from '@/commons/api/firebase.server';
import { parseDocument, parseDocuments } from '@/commons/lib/firestoreDocument';
import Logger from '@/commons/lib/logger';

import { snippetDocument } from '../model/snippetDocument';
import { type ISnippet } from './types';

interface GetSnippetProps {
  title: string;
}

export async function getSnippet(props: GetSnippetProps) {
  const { title } = props;
  const docRef = doc(db, 'snippets', title);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    const NotFoundError = new Error(`${title}에 해당하는 스니펫이 없습니다`);
    Logger.error(NotFoundError);
    throw NotFoundError;
  }

  return parseDocument(snippetDocument, docSnap);
}

/**
 * @description 스니펫 전체 목록을 조회한다
 * @returns 스니펫 목록
 */
export async function getSnippets() {
  const snapshot = await getDocs(collection(db, 'snippets'));
  return parseDocuments(snippetDocument, snapshot.docs);
}

interface IncreaseSnippetViewsProps {
  title: string;
}

/**
 * @description 스니펫 조회수를 1 올리고, 올린 뒤의 값을 돌려준다
 *
 * 동시 요청에서 조회수가 빠지지 않도록 `increment()` 로 올린다.
 * 문서가 없으면 `updateDoc` 이 실패한다. 공개 API 에서 부르는 함수라 없는 문서를 새로 만들지 않는다.
 * @param props.title 문서 id. URL 의 제목 그대로다
 * @returns 올린 뒤의 조회수
 * @throws 문서가 없으면 에러가 발생한다
 */
export async function increaseSnippetViews({ title }: IncreaseSnippetViewsProps): Promise<number> {
  const docRef = doc(db, 'snippets', title);
  await updateDoc(docRef, { views: increment(1) });
  const snap = await getDoc(docRef);
  return snap.data()?.views ?? 0;
}

interface UpdateSnippetProps {
  title: string;
  data: Partial<ISnippet>;
  isUpdateSnippet?: boolean;
}

export async function updateSnippet(props: UpdateSnippetProps) {
  const { title, data, isUpdateSnippet = false } = props;
  try {
    const docRef = doc(db, 'snippets', title);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const updatedData = isUpdateSnippet
        ? { ...data, views: docSnap.data().views || data.views }
        : data;
      await updateDoc(docRef, updatedData);
    } else {
      await setDoc(docRef, data);
    }

    if (isUpdateSnippet) {
      Logger.success(`${title}에 스니펫을 업데이트하였습니다.`);
    } else {
      Logger.log(`${title} views update : ${data.views}`);
    }
  } catch (err) {
    if (err instanceof Error) {
      const NotFoundError = new Error(`${title}에 해당하는 스니펫이 없습니다`, {
        cause: err,
      });
      Logger.error(NotFoundError);
      throw NotFoundError;
    }
  }
}
