import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

import { db } from '@/commons/api/firebase.server';
import { parseDocuments } from '@/commons/lib/firestoreDocument';

import { toStatId } from '../lib/statKey';
import { type StatKind, type StatMap, type StatValues } from '../model/stat';
import { statDocument } from '../model/statDocument';

const STATS_COLLECTION = 'stats';

const statRef = (kind: StatKind, key: string) => doc(db, STATS_COLLECTION, toStatId(kind, key));

const toValues = (data: { views?: number; likes?: number } | undefined): StatValues => ({
  views: data?.views ?? 0,
  likes: data?.likes ?? 0,
});

/**
 * @description 한 종류의 통계를 전부 읽는다. 목록 화면이 한 번 불러 카드마다 숫자를 끼운다
 * @param kind 콘텐츠 종류
 * @returns 콘텐츠 키별 `{ views, likes }`
 */
export async function getStats(kind: StatKind): Promise<StatMap> {
  const snapshot = await getDocs(
    query(collection(db, STATS_COLLECTION), where('kind', '==', kind)),
  );
  return Object.fromEntries(
    parseDocuments(statDocument, snapshot.docs).map((stat) => [stat.key, toValues(stat)]),
  );
}

/**
 * @description 콘텐츠 하나의 통계를 읽는다
 * @param kind 콘텐츠 종류
 * @param key 콘텐츠 키
 * @returns `{ views, likes }`. 통계 문서가 없으면 둘 다 0
 */
export async function getStat(kind: StatKind, key: string): Promise<StatValues> {
  const snap = await getDoc(statRef(kind, key));
  return toValues(snap.data());
}

/**
 * @description 조회수를 1 올리고, 올린 뒤의 값을 돌려준다
 *
 * `increment()` 로 Firestore 가 서버에서 더해 동시 요청에서도 빠지지 않는다.
 * 통계 문서가 없으면 `updateDoc` 이 실패한다. 공개 API 에서 부르므로 없는 키로 문서를 새로 만들지 않는다.
 * 문서는 발행(`ensureStat`)과 이전 스크립트가 만든다.
 * @param kind 콘텐츠 종류
 * @param key 콘텐츠 키
 * @returns 올린 뒤의 조회수
 * @throws 통계 문서가 없으면 에러
 */
export async function increaseViews(kind: StatKind, key: string): Promise<number> {
  const ref = statRef(kind, key);
  await updateDoc(ref, { views: increment(1) });
  return toValues((await getDoc(ref)).data()).views;
}

/**
 * @description 좋아요를 `count` 만큼 올리고, 올린 뒤의 값을 돌려준다
 *
 * 브라우저가 쓰로틀로 모은 클릭 수를 한 번에 보낸다. `increaseViews` 처럼 통계 문서가 없으면 실패하고
 * 없는 키로 문서를 만들지 않는다.
 * @param kind 콘텐츠 종류
 * @param key 콘텐츠 키
 * @param count 올릴 수. 호출하는 쪽이 1~100 으로 검사한다
 * @returns 올린 뒤의 좋아요 수
 * @throws 통계 문서가 없으면 에러
 */
export async function increaseLikes(kind: StatKind, key: string, count: number): Promise<number> {
  const ref = statRef(kind, key);
  await updateDoc(ref, { likes: increment(count) });
  return toValues((await getDoc(ref)).data()).likes;
}

/**
 * @description 발행한 콘텐츠의 통계 문서를 만들거나 Notion 페이지 ID 를 갱신한다
 *
 * `merge` 로 쓰므로 이미 있는 `views`, `likes` 는 건드리지 않는다.
 * @param kind 콘텐츠 종류
 * @param key 콘텐츠 키
 * @param notionPageId 댓글을 다는 Notion 페이지 ID
 */
export async function ensureStat(kind: StatKind, key: string, notionPageId: string): Promise<void> {
  await setDoc(statRef(kind, key), { kind, key, notionPageId }, { merge: true });
}
