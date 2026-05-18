# Firestore 쿼리 & 인덱스 규칙

## 1. 복합 인덱스가 필요한 쿼리 조합

Firestore는 다중 필드를 걸친 쿼리를 단일 필드 인덱스로 처리하지 못한다. 아래 조합은 반드시 복합 인덱스가 있어야 실행된다. 없으면 쿼리가 실패하고 브라우저에서 AbortError로 올라온다.

| 쿼리 조합 | 복합 인덱스 필요 여부 |
|----------|-------------------|
| `where(A) + orderBy(B)` (A ≠ B) | ✅ 필요 |
| `where(A) + where(B, range) + orderBy(B)` | ✅ 필요 |
| `where(A) + orderBy(A)` | ❌ 단일 인덱스로 처리 |
| `where(A, '==') + where(B, '==')` | ❌ 단일 인덱스로 처리 |
| `orderBy(A)` 단독 | ❌ 단일 인덱스로 처리 |

## 2. 인덱스 정의 위치

복합 인덱스는 `firestore.indexes.json`에 정의하고, `firebase.json`의 `firestore.indexes`에 연결한다.

```json
// firestore.indexes.json
{
  "indexes": [
    {
      "collectionGroup": "posts",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "deletedAt", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

## 3. 인덱스 배포 절차

쿼리를 구현하기 전에 인덱스를 먼저 배포한다. 인덱스 빌드는 1~2분 소요된다.

```bash
firebase deploy --only firestore:indexes
```

## 4. 소프트 딜리트 필터링 원칙

`deletedAt` 필드로 소프트 딜리트를 관리한다.

### ✅ Firestore 레벨 필터 (권장 — limit 기반 페이지네이션 필수)

`limit(N)`이 포함된 쿼리에서는 반드시 Firestore 레벨에서 `where('deletedAt', '==', null)`을 걸어야 한다. JS 레벨에서 필터하면 삭제된 문서가 limit을 다 차지해 active 문서가 0개인 빈 페이지가 노출된다.

```ts
// ✅ 페이지네이션 쿼리 — Firestore 레벨 필터 + 복합 인덱스 필요
query(
  collection(db, 'posts'),
  where('deletedAt', '==', null),
  orderBy('createdAt', 'desc'),
  limit(pageSize),
)
```

### ⚠️ JS 레벨 필터 (복합 인덱스 없을 때 임시 대안)

limit 없이 전체 조회하는 경우에만 허용. limit과 함께 쓰면 페이지네이션 버그 발생.

```ts
// ⚠️ limit 없는 전체 조회에서만 허용
const snap = await getDocs(collection(db, 'posts'));
return snap.docs.map((d) => d.data() as PostDocument).filter((p) => !p.deletedAt);
```
