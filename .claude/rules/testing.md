# 테스트 규칙

Vitest 로 돌린다. 설정은 `vitest.config.ts`, 공통 setup 은 `vitest.setup.ts` 다.

```bash
pnpm test         # 한 번 돌린다
pnpm test:watch   # 파일을 보며 돌린다
```

---

## 1. 파일 이름과 위치

**테스트는 대상 파일 옆에 둔다.** 별도 `__tests__` 폴더를 만들지 않는다.

| 대상 | 파일 이름 | 환경 |
| --- | --- | --- |
| 순수 함수 (`lib/`, `model/`, `helper/`) | `{이름}.spec.ts` | jsdom |
| 컴포넌트 (`ui/`) | `{이름}.test.tsx` | jsdom |

```
src/commons/lib/convertString.ts
src/commons/lib/convertString.spec.ts ← 옆에 둔다
src/commons/ui/Badge.tsx
src/commons/ui/Badge.test.tsx         ← 옆에 둔다
```

---

## 2. 무엇을 먼저 쓰는가

**Firestore 나 Notion 을 부르지 않는 함수부터 쓴다.** 목을 세우지 않아도 되고, 깨지면 원인이 하나다.

쓰지 않는 것도 정해 둔다.

- 외부 API 를 직접 부르는 함수 (`getPost`, `createPost` 등) 는 지금 쓰지 않는다. 목 없이 못 돌고, 목을 세우면 목이 맞는지를 다시 확인해야 한다
- React Router loader 와 action 은 지금 쓰지 않는다. 라우트 구조가 바뀌는 중이라 곧 다시 써야 한다

---

## 3. 이름은 동작을 적는다

`describe` 와 `it` 에 **무엇이 일어나는지**를 한국어로 적는다. 함수 이름과 메서드 이름을 그대로 옮기지 않는다.

```ts
// ✅ 읽으면 무슨 동작인지 안다
describe('urlPathToCookieName 은 쿠키 이름으로 쓸 수 있는 글자만 남긴다', () => {
  it('남는 글자가 없으면 page 로 대체한다', () => { ... });
});

// ❌ 코드를 다시 읽어야 안다
describe('convertString', () => {
  it('should work', () => { ... });
});
```

같은 규칙을 값만 바꿔 여러 번 볼 때는 `it.each` 로 표를 만든다.

---

## 4. 파일 맨 위에 왜 쓰는지 적는다

**이 테스트가 무엇을 막는지**를 JSDoc 블록으로 남긴다. 나중에 테스트가 깨졌을 때 고칠지 지울지를 그 문장으로 판단한다.

```ts
/**
 * `getCookie` 는 쿠키 헤더에서 값 하나를 꺼낸다. 다크모드 초기값과 조회수 중복 방지가 걸려 있다.
 *
 * 정규식으로 찾기 때문에 다른 쿠키 이름의 뒷부분과 겹치면 엉뚱한 값을 꺼낸다.
 * 쿠키 이름이 URL 경로에서 만들어지는 구조라 실제로 겹칠 수 있어서 여기서 드러내 둔다.
 */
```

특히 **조용히 실패하는 동작**은 반드시 적는다. 화면이 멀쩡한데 값만 틀리는 것들이다. 쿠키 이름, meta tag, 이미지 URL 치환이 여기 해당한다.

---

## 5. 알면서 남겨둔 동작도 고정한다

고치지 않기로 한 동작도 테스트로 적어 둔다. 다음 사람이 버그로 오해하고 고치다가 다른 것을 깨뜨리는 일을 막는다.

```ts
/**
 * 새 배열을 돌려주는 것이 아니라 받은 배열을 직접 정렬한다.
 * 부르는 쪽이 원본을 다시 쓸 생각이면 복사해서 넘겨야 한다.
 */
it('돌려준 배열이 넣은 배열과 같은 객체다', () => {
  expect(sortPosts(rows, 'desc')).toBe(rows);
});
```

---

## 6. 컴포넌트는 역할로 찾는다

`getByRole` 을 먼저 쓴다. 클래스 이름이나 `data-testid` 로 찾으면 스타일을 고칠 때 같이 깨진다.

```tsx
// ✅ 접근성 트리에서 찾는다
screen.getByRole('heading', { level: 1, name: 'Post' });

// ❌ 마크업에 묶인다
container.querySelector('.text-\\[3\\.5rem\\]');
```

클래스를 직접 보는 것은 **그 클래스가 동작을 결정할 때만** 한다. `whitespace-nowrap` 처럼 없으면 레이아웃이 깨지는 것들이다.

---
