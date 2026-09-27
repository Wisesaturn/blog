import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';

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

  return parseDocument({ schema: snippetDocument, doc: docSnap });
}

/**
 * @description 스니펫 전체 목록을 조회한다
 * @returns 스니펫 목록
 */
export async function getSnippets() {
  const snapshot = await getDocs(collection(db, 'snippets'));
  return parseDocuments({ schema: snippetDocument, docs: snapshot.docs });
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
      // 조회수와 좋아요는 stats 문서에 있다 (#117). 본문 문서만 덮어쓴다
      await updateDoc(docRef, data);
    } else {
      await setDoc(docRef, data);
    }

    if (isUpdateSnippet) Logger.success(`${title}에 스니펫을 업데이트하였습니다.`);
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
