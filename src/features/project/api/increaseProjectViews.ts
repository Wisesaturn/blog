import {
  collection,
  getDoc,
  getDocs,
  increment,
  limit,
  query,
  updateDoc,
} from 'firebase/firestore';

import { db } from '@/commons/api/firebase';

interface Props {
  title: string;
}

/**
 * @description 프로젝트 조회수를 1 올리고, 올린 뒤의 값을 돌려준다
 *
 * 프로젝트는 `projects/{title}/meta/{index}` 에 조회수가 있다. `index` 를 모르므로 `meta` 의
 * 첫 문서를 찾아 올린다. `getProject` 도 같은 문서를 읽는다.
 *
 * 동시 요청에서 조회수가 빠지지 않도록 `increment()` 로 올린다.
 * @param props.title 프로젝트 이름. URL 의 제목 그대로다
 * @returns 올린 뒤의 조회수
 * @throws `meta` 문서가 없으면 에러가 발생한다
 */
export default async function increaseProjectViews({ title }: Props): Promise<number> {
  const metaSnap = await getDocs(query(collection(db, 'projects', title, 'meta'), limit(1)));
  if (metaSnap.empty) throw new Error(`${title}에 해당하는 프로젝트가 없습니다`);

  const docRef = metaSnap.docs[0].ref;
  await updateDoc(docRef, { views: increment(1) });
  const snap = await getDoc(docRef);
  return snap.data()?.views ?? 0;
}
