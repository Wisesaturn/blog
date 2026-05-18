---
paths:
  - 'src/entities/**'
  - 'src/features/**'
---

# API 인터페이스 규칙

entities 레이어의 Firebase API는 3파일 구조로 구성한다.
features에서 mutation은 apis.ts 함수를 직접 import해 사용한다.

---

## 1. entities `api/` 3파일 구조

```
entities/{domain}/api/
├── apis.ts      # 개별 async 함수 — Firestore 직접 호출
├── queries.ts   # queryOptions() 팩토리 — TanStack Query 래핑
└── types.ts     # API 입출력 타입
```

### apis.ts — 개별 함수 export

**API 객체로 묶지 않는다.** 각 함수를 개별 `export async function`으로 선언한다.

```typescript
// ✅ entities/post/api/apis.ts
import { collection, getDocs, doc, getDoc, addDoc } from 'firebase/firestore';
import { db } from '@/commons/api';
import { type PostDocument, type CreatePostInput } from './types';

/**
 * @description 전체 포스트 목록 조회
 */
export async function getPosts(): Promise<PostDocument[]> {
  const snap = await getDocs(collection(db, 'posts'));
  return snap.docs.map((d) => d.data() as PostDocument);
}

/**
 * @description 포스트 생성
 * @param input 생성할 포스트 데이터
 */
export async function createPost(input: CreatePostInput): Promise<void> {
  await addDoc(collection(db, 'posts'), input);
}
```

```typescript
// ❌ 금지 — API 객체로 묶는 패턴
export const postAPI = {
  getPosts: async () => { ... },
} as const;
```

### queries.ts — queryOptions 팩토리

TanStack Query v5 `queryOptions()`로 queryKey와 queryFn을 묶는다.
**Remix loader로 처리하는 데이터는 여기에 두지 않는다.**
클라이언트사이드 fetch(좋아요 수, 실시간 댓글 등)에만 사용한다.

```typescript
// entities/post/api/queries.ts
import { queryOptions } from '@tanstack/react-query';
import { getPosts, getPostById } from './apis';

export const postQueries = {
  ALL: ['post'] as const,

  list: () =>
    queryOptions({
      queryKey: [...postQueries.ALL, 'list'] as const,
      queryFn: () => getPosts(),
    }),

  byId: (id: string) =>
    queryOptions({
      queryKey: [...postQueries.ALL, 'detail', id] as const,
      queryFn: () => getPostById(id),
    }),
};
```

### types.ts — 타입 정의

각 도메인 타입을 구분선 주석으로 분리한다.

```typescript
// entities/post/api/types.ts
import { type Timestamp } from 'firebase/firestore';

/* -------------------------------------------------------------------------------------------------
 * post
 * -----------------------------------------------------------------------------------------------*/

export type PostDocument = {
  id: string;
  title: string;
  createdAt: Timestamp;
};

export type CreatePostInput = Omit<PostDocument, 'id'>;
```

---

## 2. features에서 API 사용 패턴

### 조회 — queryOptions 사용 (클라이언트 fetch)

```typescript
// features/post-like/ui/LikeButton.tsx
import { postQueries } from '@/entities/post';
import { skipToken, useQuery } from '@tanstack/react-query';

const { data } = useQuery(postQueries.byId(postId));
```

### 조건부 실행 — skipToken

`enabled` 대신 `queryFn`에 `skipToken`을 사용한다.

```typescript
import { skipToken, useQuery } from '@tanstack/react-query';

// ✅ skipToken
const { data } = useQuery({
  ...postQueries.byId(id ?? skipToken),
});

// ❌ enabled
const { data } = useQuery({
  ...postQueries.byId(id ?? ''),
  enabled: !!id,
});
```

### 뮤테이션 — apis.ts 직접 import

```typescript
// features/post-create/ui/PostCreateForm.tsx
import { createPost } from '@/entities/post';

const { mutate } = useMutation({
  mutationFn: createPost,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: postQueries.ALL }),
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
