# FSD 구조 규칙 (Feature-Sliced Design)

blog 프로젝트의 FSD 아키텍처 규칙을 정의한다.
공식 FSD 문서(https://feature-sliced.design)를 기반으로 Remix 환경에 맞게 조정했다.

---

## 1. 레이어 구조

```
src/
├── app/            # Remix 라우팅 전용 (app/routes/ → src/pages/ 브릿지)
│   └── routes/     # Remix route 파일 — src/pages/{page}의 실 구현체를 import만 함
│
├── pages/          # 페이지 조합 레이어 (app/routes/의 실 구현체)
├── modules/        # 전역 레이아웃 컴포넌트 (Header, Footer, Nav 등)
├── features/       # 사용자 행동 단위 (검색, 좋아요, 댓글 등)
├── entities/       # 비즈니스 엔티티 + Firebase API 함수
└── commons/        # 공유 코드 (의존성 없음)
    ├── api/        # Firebase 앱 싱글턴 초기화
    ├── config/     # 환경변수, 앱 상수
    ├── lib/        # 유틸 함수 (cn.ts 등)
    ├── types/      # 공통 TypeScript 타입
    └── ui/         # 재사용 기본 UI 컴포넌트
```

> `shared/`, `widgets/` 레이어는 사용하지 않는다.

### 레이어 의존 방향 (단방향)

```
app → pages → modules → features → entities → commons
```

- 같은 레이어 내 슬라이스 간 직접 import 금지 (entities 간 `@x` 타입 참조는 허용)
- 상위 레이어는 하위 레이어만 import 가능
- `app/routes/` 파일은 `src/pages/`에서 import하는 브릿지 역할만 수행

---

## 2. commons 세그먼트 규칙

### `commons/api/`

Firebase 앱 싱글턴 초기화만 담당한다. 쿼리·뮤테이션 로직은 절대 포함하지 않는다.

```
commons/api/
├── firebase.ts     # initializeApp, getAuth, getFirestore → auth, db export
└── index.ts        # barrel export (auth, db)
```

**규칙**:
- `getDoc`, `collection`, `setDoc`, `updateDoc`, `deleteDoc` 등 **Firestore 직접 호출은 이 파일에 없음**
- Firestore SDK 직접 호출은 **entities 슬라이스의 `api/apis.ts`에서만** 허용
- 모든 레이어는 `import { db } from '@/commons/api'` 로 싱글턴만 가져온다

### `commons/lib/`

도메인(주제) 단위 파일로 구성한다.

```
commons/lib/
├── cn.ts           # clsx + tailwind-merge 조합 유틸
└── index.ts        # barrel export
```

#### 도메인 폴더 생성 기준

단일 파일이 200줄을 넘거나, 동일 도메인 파일이 3개 이상이면 폴더로 분리한다.

### `commons/ui/`

순수 재사용 UI 컴포넌트. 비즈니스 로직 없음.

```
commons/ui/
├── Button.tsx
├── Input.tsx
├── ...
└── index.ts
```

### `commons/config/`

환경변수 접근, 앱 전역 상수.

### `commons/types/`

여러 레이어에서 공유되는 TypeScript 타입.

---

## 3. entities 레이어 규칙

### 도메인 분리 원칙

**한 슬라이스에는 한 도메인만** 포함한다.

```
entities/
├── post/       # 포스트 CRUD
├── snippet/    # 스니펫 CRUD
└── user/       # 유저 타입 + 관련 로직
```

### `api/` 세그먼트 — 3파일 구조

반드시 3파일로 분리한다. **Firestore SDK 직접 호출은 `apis.ts`에서만 허용**한다.

```
entities/{domain}/api/
├── apis.ts      # 개별 async 함수 export — Firestore 직접 호출
├── queries.ts   # queryOptions() 팩토리 — TanStack Query 래핑 (클라이언트 fetch용)
└── types.ts     # API 입출력 타입
```

#### `apis.ts` — 개별 함수 export

**API 객체(`postAPI = { ... }`)로 묶지 않는다.** 각 함수를 개별 `export async function`으로 선언한다.

```typescript
// ✅ entities/post/api/apis.ts
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/commons/api';
import { type PostDocument } from './types';

export async function getPosts(): Promise<PostDocument[]> {
  const snap = await getDocs(collection(db, 'posts'));
  return snap.docs.map((d) => d.data() as PostDocument);
}

export async function getPostById(id: string): Promise<PostDocument | null> {
  const snap = await getDoc(doc(db, 'posts', id));
  return snap.exists() ? (snap.data() as PostDocument) : null;
}
```

```typescript
// ❌ 금지 — API 객체로 묶는 패턴
export const postAPI = {
  getPosts: async () => { ... },
} as const;
```

#### `queries.ts` — queryOptions 팩토리

TanStack Query v5 `queryOptions()`로 queryKey와 queryFn을 묶는다.
**Remix loader로 처리하는 서버사이드 데이터는 여기에 두지 않는다. 클라이언트사이드 fetch가 필요한 경우에만** 사용한다.

```typescript
// ✅ entities/post/api/queries.ts
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

뮤테이션은 컴포넌트 또는 커스텀 훅에서 `apis.ts`의 함수를 직접 import해 `useMutation`에 연결한다.

#### `types.ts` — 타입 정의

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

### entities 간 `@x` 참조

```typescript
// entities 내 타입 공유가 필요한 경우
import { type PostDocument } from '@x/entities/post';
```

`@x` 참조는 타입 import로만 제한한다.

---

## 4. 슬라이스 세그먼트 규칙

각 슬라이스는 다음 세그먼트 중 필요한 것만 포함한다.

### `model/` — 상태·행동 로직

- zustand store, Zod 스키마, 비즈니스 로직 훅
- 순수 함수 중심 유틸은 `lib/`에 위치

### `lib/` — 유틸 함수

- 순수 함수 또는 React 외부 유틸
- 브라우저/전역 이벤트 등록 훅은 `model/`에 위치

### `ui/` — 컴포넌트

- 해당 슬라이스 전용 컴포넌트
- 외부에 노출할 컴포넌트만 `index.ts`에 re-export

---

## 5. 네이밍 컨벤션

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 파일 | PascalCase | `PostCard.tsx` |
| 함수/유틸 파일 | camelCase | `useAuth.ts`, `cn.ts` |
| 폴더 | kebab-case | `post-card/`, `snippet-form/` |
| 컴포넌트 | PascalCase | `PostCard`, `SnippetForm` |
| 함수/변수 | camelCase | `createPost`, `postList` |
| 상수 | UPPER_SNAKE_CASE | `MAX_POST_COUNT` |
| 타입/인터페이스 | PascalCase | `PostDocument`, `SnippetType` |
| Remix 규약 파일 | 예외 | `route.tsx`, `loader.ts` |

---

## 6. Import 규칙

- 경로 alias: `@/*` → `src/*`
- 슬라이스 public API는 반드시 `index.ts`를 통해 import (pages/features/entities/modules)
- 같은 레이어 내 슬라이스 간 직접 import 금지 (entities `@x` 타입 참조 제외)
- ESLint: `eslint-plugin-fsd` 적용

```typescript
// ✅ 올바른 import
import { cn, cva, type VariantProps } from '@/commons/lib';
import { getPosts, postQueries } from '@/entities/post';   // index.ts 경유

// ❌ 금지
import { getPosts } from '@/entities/post/api/apis';       // index.ts 우회
import { postQueries } from '@/entities/post';              // features → features 크로스
```
