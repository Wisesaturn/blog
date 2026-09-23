import { collection, getDocs } from 'firebase/firestore';

import { db } from '$shared/middleware/firebase';

import { ISnippet } from '../types/snippet';

/**
 * @description 스니펫 전체 목록을 조회한다
 * @returns 스니펫 목록
 */
export default async function getSnippets() {
  const snapshot = await getDocs(collection(db, 'snippets'));
  return snapshot.docs.map((doc) => doc.data()) as ISnippet[];
}
