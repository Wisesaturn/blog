---
paths:
  - 'src/entities/**'
  - 'src/features/**'
---

# API 인터페이스 규칙

데이터를 읽고 쓰는 경로는 두 가지다. 어느 쪽에서 부르느냐로 파일이 갈린다.

```
서버   loader · action · API 라우트 ──→ apis.ts ──→ Firestore
브라우저  컴포넌트 · 훅 ──→ queries.ts ──→ apis.client.ts ──fetch──→ API 라우트(/api/…) ──→ apis.ts
```

- `apis.ts` 는 Firestore SDK 를 부르는 서버 전용 코드다. 슬라이스의 `index.server.ts` 로만 내보낸다. 클라이언트 번들에 섞이면 React Router 가 빌드를 실패시킨다
- 브라우저는 `apis.ts` 를 부르지 않는다. `apis.client.ts` 로 우리 API 라우트(BFF)를 부르고, 라우트가 `apis.ts` 를 부른다
- 이름의 `.server`, `.client` 를 React Router 가 강제한다. `.server` 모듈이 클라이언트 번들에 섞이면 빌드가 실패하고, `.client` 모듈은 서버 번들에서 빈 모듈이 된다
- 페이지 내용은 loader 가 읽는다. prerender 하는 페이지에서 발행 뒤에도 바뀌는 값(조회수, 좋아요, 댓글)은 loader 에 두지 않고 브라우저에서 `queries.ts` 로 받는다. 서버에서 prefetch 하면 빌드 시점의 값이 HTML 에 굳는다

---

## 1. entities `api/` 구조

```
entities/{domain}/
├── api/
│   ├── apis.ts         # 서버. 개별 async 함수 — Firestore 직접 호출           → index.server.ts
│   ├── apis.client.ts  # 브라우저. 개별 async 함수 — API 라우트 fetch + 응답 검사 → queries.ts, mutation
│   └── queries.ts      # 브라우저. queryOptions() 팩토리 — apis.client.ts 를 부름 → index.ts
└── model/
    └── {name}.ts    # zod 스키마와 z.infer 타입
```

필요한 파일만 둔다. 브라우저가 부를 일이 없는 슬라이스는 `apis.client.ts`, `queries.ts` 가 없다. 같은 API 를 서버와 브라우저 어느 쪽에서 부르느냐로 `apis.ts` 와 `apis.client.ts` 가 갈린다.

### apis.ts — 서버, 개별 함수 export

**API 객체로 묶지 않는다.** 각 함수를 개별 `export async function`으로 선언한다. Firestore 에서 읽은 문서는 `parseDocuments` / `parseDocument` 로 zod 스키마 검사를 거친다.

```typescript
// ✅ entities/stats/api/apis.ts
import { collection, getDocs, query, where } from 'firebase/firestore';

import { db } from '@/commons/api/firebase.server';
import { parseDocuments } from '@/commons/lib/firestoreDocument';

import { statDocument } from '../model/statDocument';

/**
 * @description 한 종류의 통계를 전부 읽는다
 * @param kind 콘텐츠 종류
 * @returns 콘텐츠 키별 `{ views, likes }`
 */
export async function getStats(kind: StatKind): Promise<StatMap> {
  const snapshot = await getDocs(query(collection(db, 'stats'), where('kind', '==', kind)));
  return Object.fromEntries(
    parseDocuments(statDocument, snapshot.docs).map((stat) => [stat.key, toValues(stat)]),
  );
}
```

```typescript
// ❌ 금지 — API 객체로 묶는 패턴
export const postAPI = {
  getPosts: async () => { ... },
} as const;
```

### apis.client.ts — 브라우저, API 라우트(BFF) 호출

브라우저가 우리 API 라우트(`/api/…`)를 부르는 fetch 함수다. **Firestore 를 import 하지 않는다.** 조회 함수는 `queries.ts` 가 감싸서 내보내고, mutation 에 쓰는 함수(좋아요, 댓글 작성 등)만 `index.ts` 로 직접 내보낸다.

- 개별 `export async function` 으로 선언한다
- 호출은 `fetch` 를 직접 쓰지 않고 **`commons/api/requestJson`** 으로 한다. 응답을 zod 스키마로 검사하고(`as T` 단언 금지), 실패를 던져 `useQuery`·`useMutation` 이 에러로 받게 한다
  - 상태 코드가 실패면 `ApiError` (`status`, `url`, `body`). 화면은 `error instanceof ApiError && error.status === 429` 처럼 상태 코드로 다르게 반응한다
  - 응답 모양이 스키마와 다르면 zod 검사 에러(`z.core.$ZodError`). 서버와 클라이언트의 약속이 깨졌다는 뜻이다
  - 본문은 `json` 옵션으로 넘긴다. 직렬화와 `Content-Type` 을 `requestJson` 이 한다
- `AbortSignal` 을 받아 넘긴다. 화면을 떠나면 TanStack Query 가 요청을 끊는다
- 경로는 경로 함수 하나에서 만든다. 라우트와 모양이 어긋나지 않게 한다

```typescript
// ✅ entities/stats/api/apis.client.ts
import { requestJson } from '@/commons/api/requestJson';

import { statValues, type StatKind, type StatValues } from '../model/stat';

/**
 * @description 콘텐츠 하나의 통계를 받는다 (브라우저)
 * @param kind 콘텐츠 종류
 * @param key 콘텐츠 키
 * @param signal 화면을 떠나면 요청을 끊는 신호
 * @returns `{ views, likes }`
 */
export async function fetchStat(kind: StatKind, key: string, signal?: AbortSignal): Promise<StatValues> {
  return requestJson(statPath(kind, key), statValues, { signal });
}
```

```typescript
// ❌ 금지 — 브라우저 코드에서 apis.ts 를 부름 (빌드 실패)
import { getStat } from '@/entities/stats/index.server';

// ❌ 금지 — fetch 를 직접 부르고 응답을 검사하지 않고 단언
const res = await fetch(statPath(kind, key));
return (await res.json()) as StatValues;
```

### queries.ts — queryOptions 팩토리

TanStack Query v5 `queryOptions()` 로 queryKey 와 queryFn 을 묶는다. **queryFn 은 `apis.client.ts` 의 함수만 부른다.** `queries.ts` 는 서버 렌더에서도 import 되지만 queryFn 은 브라우저에서만 실행된다.

- `staleTime` 은 API 라우트의 `Cache-Control` 과 맞춘다. 라우트가 60초 캐시되면 브라우저도 60초 동안 다시 부르지 않는다
- 조회수처럼 부르는 것 자체가 값을 올리는 요청은 `staleTime: Infinity`, `retry: false` 로 한 번만 부른다

```typescript
// ✅ entities/stats/api/queries.ts
import { queryOptions } from '@tanstack/react-query';

import { fetchStat, fetchStats } from './apis.client';

export const statsQueries = {
  ALL: ['stats'] as const,

  list: (kind: StatKind) =>
    queryOptions({
      queryKey: [...statsQueries.ALL, kind, 'list'] as const,
      queryFn: ({ signal }) => fetchStats(kind, signal),
      staleTime: 60_000,
    }),

  detail: (kind: StatKind, key: string) =>
    queryOptions({
      queryKey: [...statsQueries.ALL, kind, 'detail', key] as const,
      queryFn: ({ signal }) => fetchStat(kind, key, signal),
    }),
};
```

### model — zod 스키마와 타입

타입은 따로 쓰지 않고 **zod 스키마에서 `z.infer` 로 뽑는다.** 스키마 하나가 검사와 타입을 함께 맡는다.

- 클라이언트 번들에 들어가는 스키마(`apis.client.ts`, 화면이 쓰는 것)는 `zod/mini` 로 쓴다
- 서버에서만 쓰는 Firestore 문서 스키마는 `zod` 로 쓴다. `parseDocuments` 가 `zod` 타입을 받는다
- 라우트 파라미터와 쿼리스트링도 같은 스키마로 검사한다 (`statKind.safeParse(params.kind)`)

```typescript
// entities/stats/model/stat.ts
import * as z from 'zod/mini';

export const statKind = z.enum(['post', 'snippet', 'project']);
export type StatKind = z.infer<typeof statKind>;

export const statValues = z.object({ views: z.number(), likes: z.number() });
export type StatValues = z.infer<typeof statValues>;
```

---

## 2. features에서 API 사용 패턴

### 조회 — queryOptions 사용

```typescript
// features/view-count/model/useContentStats.ts
import { useQuery } from '@tanstack/react-query';

import { statsQueries } from '@/entities/stats';

const detail = useQuery(statsQueries.detail(kind, key));
```

- 서버에 요청하는 조회는 `useQuery` 를 쓴다. `useSuspenseQuery` 는 서버 렌더와 prerender 에서도 요청을 시도해 상대 경로가 실패하거나 빌드 시점 값이 굳는다
- 받는 중(`undefined`)과 받지 못함(에러)을 화면에서 다르게 보여 준다. 실패를 따로 그리지 않으면 skeleton 이 영영 남는다

### 조건부 실행 — skipToken

`enabled` 대신 `queryFn`에 `skipToken`을 사용한다.

```typescript
import { skipToken, useQuery } from '@tanstack/react-query';

// ✅ skipToken
const { data } = useQuery({
  ...statsQueries.detail(kind, key ?? skipToken),
});

// ❌ enabled
const { data } = useQuery({
  ...statsQueries.detail(kind, key ?? ''),
  enabled: !!key,
});
```

### 뮤테이션 — apis.client.ts 함수 + 캐시 직접 갱신

`mutationFn` 에는 `apis.client.ts` 의 함수를 넘긴다. 슬라이스는 이 함수를 `index.ts` 로 내보낸다. 낙관적 업데이트는 `setQueryData` 로 해당 쿼리 캐시를 고치고, 응답이 오면 서버 값으로 맞춘다.

```typescript
// features/like/model/useLike.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { postLike, statsQueries } from '@/entities/stats';

const queryClient = useQueryClient();
const { queryKey } = statsQueries.detail(kind, key);

const { mutate } = useMutation({
  mutationFn: (count: number) => postLike(kind, key, count),
  onSuccess: (likes) => queryClient.setQueryData(queryKey, (prev) => prev && { ...prev, likes }),
});
```

---

## 3. 커스텀 query/mutation 훅 (features)

```
features/post-create/
├── api/
│   └── usePostCreate.ts   # useMutation 래퍼
└── model/
    └── usePostForm.ts     # useForm + mutation 조합 훅
```

훅 파일에는 반드시 JSDoc `@description`을 작성한다.
