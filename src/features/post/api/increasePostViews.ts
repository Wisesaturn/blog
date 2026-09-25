import { doc, getDoc, increment, updateDoc } from 'firebase/firestore';

import { db } from '@/commons/api/firebase';

interface Props {
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
export default async function increasePostViews({ category, title }: Props): Promise<number> {
  const docRef = doc(db, category, title);
  await updateDoc(docRef, { views: increment(1) });
  const snap = await getDoc(docRef);
  return snap.data()?.views ?? 0;
}
