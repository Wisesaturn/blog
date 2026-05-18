---
paths:
  - '**/*.ts'
  - '**/*.tsx'
---

# JSDoc Rules

## 1. API 함수 (`entities/[domain]/api/apis.ts`)

Firestore 직접 호출 함수에 JSDoc을 작성한다.
기본 구성: `@description` + `@param` + `@returns`. 에러를 throw하는 함수는 `@throws`를 추가한다.

```typescript
/**
 * @description 전체 포스트 목록 조회
 * @returns PostDocument 배열 (createdAt 내림차순)
 */
export async function getPosts(): Promise<PostDocument[]> { ... }
```

```typescript
/**
 * @description 포스트 생성
 * @param input 생성할 포스트 데이터
 * @throws 동일 slug의 포스트가 이미 존재하면 에러
 */
export async function createPost(input: CreatePostInput): Promise<void> { ... }
```

> `@returns`는 반환값이 `void`이면 생략한다.

---

## 2. 컴포넌트 (`*.tsx`)

컴포넌트 정의 위에 섹션 구분 주석을 사용한다.

```typescript
/* -------------------------------------------------------------------------------------------------
 * PostCard
 * 포스트 목록에서 사용하는 카드 컴포넌트. 제목, 날짜, 태그를 렌더링한다.
 * -----------------------------------------------------------------------------------------------*/
export function PostCard({ post }: PostCardProps) { ... }
```

---

## 3. 함수·유틸 (`*.ts`)

`@description` + `@param` + `@returns` 기본 구성. 코드만으로 용도 파악이 어려우면 `@example` 추가.

```typescript
/**
 * @description Firestore Timestamp를 'YYYY-MM-DD' 날짜 문자열로 변환
 * @param timestamp Firestore Timestamp
 * @returns 'YYYY-MM-DD' 형식 날짜 문자열
 * @example
 * const key = toDateKey(post.createdAt); // '2025-05-19'
 */
export function toDateKey(timestamp: Timestamp): string { ... }
```

> 코드만으로 목적이 자명할 때는 `@example` 생략.

---

## 4. Hooks (`use*.ts`)

`@description` + `@returns` 중심. params가 있으면 `@param` 추가.

```typescript
/**
 * @description 포스트 목록 쿼리 훅 (클라이언트사이드)
 * @returns { data: PostDocument[], isPending, isError }
 */
export function usePostsQuery() { ... }
```

```typescript
/**
 * @description 포스트 생성 mutation 훅
 * @returns { mutate, isPending, isError }
 */
export function useCreatePost() { ... }
```

---

## 5. `lib`, `model` 폴더의 함수

`lib/` 또는 `model/` 내 모든 export 함수에는 `@description`이 필수다.

```typescript
/**
 * @description clsx + tailwind-merge 조합 유틸
 */
export function cn(...inputs: ClassValue[]) { ... }
```
