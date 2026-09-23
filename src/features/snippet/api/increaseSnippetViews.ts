import { doc, getDoc, increment, updateDoc } from 'firebase/firestore';

import { db } from '$shared/middleware/firebase';

interface Props {
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
export default async function increaseSnippetViews({ title }: Props): Promise<number> {
  const docRef = doc(db, 'snippets', title);
  await updateDoc(docRef, { views: increment(1) });
  const snap = await getDoc(docRef);
  return snap.data()?.views ?? 0;
}
