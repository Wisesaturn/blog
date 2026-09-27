# FSD 구조 규칙 (Feature-Sliced Design)

blog 프로젝트의 FSD 아키텍처 규칙을 정의한다.
공식 FSD 문서(https://feature-sliced.design)를 기반으로 React Router 환경에 맞게 조정했다.

---

## 1. 레이어 구조

```
src/
├── app/            # React Router 루트와 라우팅
│   ├── routes/     # route 파일 — loader, meta, headers 와 pages 브리지
│   ├── lib/        # 라우팅 전용 코드 (formatHeadTags, getContentPaths)
│   ├── config/     # meta 기본값
│   └── ui/         # Document (<html>, <head>, <body>)
│
├── pages/          # 페이지 조합 레이어 (app/routes/의 실 구현체)
├── modules/        # 전역 레이아웃 컴포넌트 (Header, Footer, Nav 등)
├── features/       # 사용자 행동 단위 (검색, 좋아요, 댓글 등)
├── entities/       # 비즈니스 엔티티 + Firebase API 함수
└── commons/        # 공유 코드 (의존성 없음)
    ├── api/        # 바깥과 통신하는 공용 코드 (서비스 클라이언트 초기화, requestJson)
    ├── config/     # 환경변수, 앱 상수
    ├── lib/        # 유틸 함수 (cn.ts 등)
    ├── model/      # 레이아웃 context, 공용 훅
    ├── types/      # 공통 TypeScript 타입
    ├── ui/         # 재사용 기본 UI 컴포넌트
    └── styles/, assets/
```

> FSD 표준의 `widgets` 는 `modules`, `shared` 는 `commons` 로 부른다. `eslint.config.js` 의 `fsdOptions` 가 둘을 잇는다.

### 레이어 의존 방향 (단방향)

```
app → pages → modules → features → entities → commons
```

- 같은 레이어 내 슬라이스 간 직접 import 금지 (entities 간 `@x` 타입 참조는 허용)
- 상위 레이어는 하위 레이어만 import 가능
- `app/routes/` 파일은 loader, meta, headers 를 두고, default 는 loader 데이터를 page 에 props 로 넘기는 브리지만 한다
  - page 가 `useLoaderData<typeof loader>()` 를 부르면 pages 가 app 을 import 하게 되므로 쓰지 않는다
  - loader 를 route 에 두는 것은 서버 코드(`index.server`)를 app 레이어에만 남기기 위해서다

---

## 2. commons 세그먼트 규칙

### `commons/api/`

바깥(외부 서비스, 우리 API 라우트)과 통신하는 **도메인에 속하지 않는 공용 코드**를 둔다. 도메인별 쿼리·뮤테이션은 두지 않는다. 그것은 entities 의 `apis.ts`, `apis.client.ts` 몫이다.

```
commons/api/
├── firebase.server.ts  # 서비스 클라이언트 초기화 — initializeApp, getFirestore, getStorage → db, storage
├── notion.server.ts    # 서비스 클라이언트 초기화 — Notion
└── requestJson.ts      # HTTP 도우미 — 우리 API 라우트를 부르고 응답을 zod 로 검사, 실패는 ApiError
```

서버 전용 모듈은 이름에 `.server` 를 붙인다. 클라이언트 번들에 섞이면 React Router 가 빌드를 실패시킨다.

**규칙**:
- 들어올 수 있는 것: 서비스 클라이언트 초기화(싱글턴), 여러 슬라이스가 같이 쓰는 통신 도우미
- 특정 도메인의 경로, 스키마, 컬렉션 이름을 알면 여기가 아니라 entities 에 둔다
- `getDoc`, `collection`, `setDoc`, `updateDoc`, `deleteDoc` 등 **Firestore 직접 호출은 이 폴더에 없음**
- Firestore SDK 직접 호출은 **entities 슬라이스의 `api/apis.ts`에서만** 허용
- 모든 레이어는 `import { db } from '@/commons/api/firebase.server'` 로 싱글턴만 가져온다

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
├── post/       # 글
├── snippet/    # 스니펫
└── project/    # 프로젝트
```

### 진입점 — `index.ts` 와 `index.server.ts`

- `index.ts`: 클라이언트에서 써도 되는 것 (타입, 상수, 스키마, UI, queries)
- `index.server.ts`: Firestore 를 부르는 `apis.ts`

하나로 합치면 클라이언트 코드가 상수 하나를 가져올 때 Firebase 초기화까지 끌려온다. 초기화는 모듈 최상단 부수 효과라 tree shaking 으로 떨어지지 않는다.

### `api/` 세그먼트

**Firestore SDK 직접 호출은 `apis.ts`에서만 허용**한다. 서버용 `apis.ts`, 브라우저용 `apis.client.ts` 와 `queries.ts` 로 나눈다. 파일별 규칙과 예시는 [api-interface.md](api-interface.md) 한 곳에 둔다.

```
entities/{domain}/api/
├── apis.ts         # 서버 — Firestore 직접 호출. index.server.ts 로만 내보낸다
├── apis.client.ts  # 브라우저 — 우리 API 라우트(BFF) fetch + zod 응답 검사
└── queries.ts      # 브라우저 — queryOptions() 팩토리. apis.client.ts 만 부른다
```

타입은 `model/` 의 zod 스키마에서 `z.infer` 로 뽑는다.

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
| React Router 규약 파일 | 예외 | `route.tsx`, `loader.ts` |

---

## 6. Import 규칙

- 경로 alias: `@/*` → `src/*`
- 슬라이스 public API는 반드시 `index.ts` 나 `index.server.ts` 를 통해 import (pages/features/entities/modules)
- commons 는 세그먼트 안 파일을 바로 가져와도 된다 (`@/commons/ui/Badge`)
- 같은 레이어 내 슬라이스 간 직접 import 금지 (entities `@x` 타입 참조 제외)
- ESLint: `eslint-plugin-fsd-lint` 가 막는다

```typescript
// ✅ 올바른 import
import { cn, cva, type VariantProps } from '@/commons/lib';
import { type IPost } from '@/entities/post';                  // index.ts 경유
import { statsQueries } from '@/entities/stats';               // 브라우저용 queries
import { getPosts } from '@/entities/post/index.server';       // 서버 전용 API (loader, API 라우트에서만)

// ❌ 금지
import { getPosts } from '@/entities/post/api/apis';       // index.ts 우회
import { TOC } from '@/features/toc';                          // features → features 크로스 (features 안에서)
```
