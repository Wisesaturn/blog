import {
  collection,
  doc,
  FirestoreError,
  getDoc,
  getDocs,
  increment,
  query,
  runTransaction,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

import { db } from '@/commons/api/firebase.server';
import { parseDocuments } from '@/commons/lib/firestoreDocument';

import { toStatId } from '../lib/statKey';
import { type StatKind, type StatMap, type StatTarget, type StatValues } from '../model/stat';
import { statDocument } from '../model/statDocument';

const STATS_COLLECTION = 'stats';

const statRef = (target: StatTarget) => doc(db, STATS_COLLECTION, toStatId(target));

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
    parseDocuments({ schema: statDocument, docs: snapshot.docs }).map((stat) => [
      stat.key,
      toValues(stat),
    ]),
  );
}

/**
 * @description 콘텐츠 하나의 통계를 읽는다
 * @param target.kind 콘텐츠 종류
 * @param target.key 콘텐츠 키
 * @returns `{ views, likes }`. 통계 문서가 없으면 둘 다 0
 */
export async function getStat(target: StatTarget): Promise<StatValues> {
  const snap = await getDoc(statRef(target));
  return toValues(snap.data());
}

/**
 * @description 조회수를 1 올리고, 올린 뒤의 값을 돌려준다
 *
 * `increment()` 로 Firestore 가 서버에서 더해 동시 요청에서도 빠지지 않는다.
 * 통계 문서가 없으면 `updateDoc` 이 실패한다. 공개 API 에서 부르므로 없는 키로 문서를 새로 만들지 않는다.
 * 문서는 발행(`ensureStat`)과 이전 스크립트가 만든다.
 * @param target.kind 콘텐츠 종류
 * @param target.key 콘텐츠 키
 * @returns 올린 뒤의 조회수
 * @throws 통계 문서가 없으면 에러
 */
export async function increaseViews(target: StatTarget): Promise<number> {
  const ref = statRef(target);
  await updateDoc(ref, { views: increment(1) });
  return toValues((await getDoc(ref)).data()).views;
}

/**
 * @description 통계 문서가 없어서 난 에러인지 가린다. 라우트가 404 와 500 을 나눌 때 쓴다
 *
 * 브라우저는 404 를 받으면 다시 보내지 않고, 500 을 받으면 다시 보낸다. 그래서 Firestore 가 잠깐 실패한
 * 것(`unavailable`, `deadline-exceeded` 등)을 404 로 돌려주면 누른 좋아요를 버리게 된다.
 * @param error `increaseViews` 가 던진 에러
 * @returns `updateDoc` 이 문서를 찾지 못해 실패했으면 true
 */
export function isMissingStat(error: unknown): boolean {
  return error instanceof FirestoreError && error.code === 'not-found';
}

/**
 * @description 좋아요를 `count` 만큼 올리고, 올린 뒤의 값을 돌려준다
 *
 * 브라우저가 1초 동안 모은 클릭 수를 한 번에 보낸다. 읽기와 쓰기를 트랜잭션 하나로 묶었다.
 * 쓰고 나서 따로 읽으면, 쓰기는 됐는데 읽기가 실패한 경우에도 에러가 된다. 그러면 브라우저가 같은 수를 다시
 * 보내 두 번 오른다. 트랜잭션이면 실패했을 때 아무것도 반영되지 않아 다시 보내도 된다.
 *
 * 통계 문서가 없으면 `null` 이다. 공개 API 에서 부르므로 없는 키로 문서를 새로 만들지 않는다.
 * @param params.kind 콘텐츠 종류
 * @param params.key 콘텐츠 키
 * @param params.count 올릴 수. 호출하는 쪽이 1~100 으로 검사한다
 * @returns 올린 뒤의 좋아요 수. 통계 문서가 없으면 `null`
 * @throws 트랜잭션이 실패하면 에러. 이때는 아무것도 반영되지 않았다
 */
export async function increaseLikes({
  count,
  ...target
}: StatTarget & { count: number }): Promise<number | null> {
  const ref = statRef(target);
  return runTransaction(db, async (transaction) => {
    const snap = await transaction.get(ref);
    if (!snap.exists()) return null;

    const likes = toValues(snap.data()).likes + count;
    transaction.update(ref, { likes });
    return likes;
  });
}

/**
 * @description 발행한 콘텐츠의 통계 문서를 만들거나 Notion 페이지 ID 를 갱신한다
 *
 * `merge` 로 쓰므로 이미 있는 `views`, `likes` 는 건드리지 않는다.
 * @param params.kind 콘텐츠 종류
 * @param params.key 콘텐츠 키
 * @param params.notionPageId 댓글을 다는 Notion 페이지 ID
 */
export async function ensureStat({
  kind,
  key,
  notionPageId,
}: StatTarget & { notionPageId: string }): Promise<void> {
  await setDoc(statRef({ kind, key }), { kind, key, notionPageId }, { merge: true });
}
