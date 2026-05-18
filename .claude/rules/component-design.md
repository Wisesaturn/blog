# 공통 UI 컴포넌트 설계 가이드

blog 프로젝트의 `src/commons/ui/` 컴포넌트 작성 규칙을 정의한다.

---

## 1. 파일 구조

- 위치: `src/commons/ui/{ComponentName}.tsx`
- 파일명: PascalCase (예: `Button.tsx`, `Input.tsx`)
- 섹션 단위 주석 블록으로 역할을 구분한다:

```tsx
/* -------------------------------------------------------------------------------------------------
 * Context
 * -----------------------------------------------------------------------------------------------*/

/* -------------------------------------------------------------------------------------------------
 * Root
 * -----------------------------------------------------------------------------------------------*/

/* -------------------------------------------------------------------------------------------------
 * Header
 * -----------------------------------------------------------------------------------------------*/

/* -------------------------------------------------------------------------------------------------
 * Item
 * -----------------------------------------------------------------------------------------------*/

/* -------------------------------------------------------------------------------------------------
 * Export
 * -----------------------------------------------------------------------------------------------*/
```

---

## 2. Compound Pattern

컴파운드 패턴이 필요한 컴포넌트는 `Object.assign`으로 export한다.

**규칙:**
- **`Root` 컴포넌트는 반드시 `Object.assign` 안에 포함시킨다** (추후 RSC 호환을 위해)
- 컴파운드 패턴이 아닌 단일 컴포넌트는 일반 export 유지 (불필요한 `Object.assign` 지양)
- `Header`, `Content`, `Footer`는 항상 형제 구조로 분리 (`Content` 안에 `Header/Footer` 금지)
- `Content`는 본문 영역만 담당 — 타이틀/액션/요약 같은 역할 침범 금지

```tsx
/* -------------------------------------------------------------------------------------------------
 * Export
 * -----------------------------------------------------------------------------------------------*/

const Dialog = Object.assign(DialogRoot, {
  Root: DialogRoot,   // ← Root 반드시 포함
  Header: DialogHeader,
  Content: DialogContent,
  Footer: DialogFooter,
});

export { Dialog };
```

---

## 3. 상태 관리

| 상황 | 도구 |
|------|------|
| Context 공유 | `createSafeContext` (`src/commons/lib/context.ts`) |

```tsx
// Context
const [FooProvider, useFoo] = createSafeContext<FooContextValue>('Foo');
```

Context 값으로 raw `Dispatch<SetStateAction<T>>`를 노출하지 않는다.
상태 변경은 목적형 래퍼 함수(`openModal`, `setValue` 등)로 감싸서 전달한다.

---

## 4. Props API 네이밍

### 공통 UI 컴포넌트 (commons/ui)

브라우저 이벤트 네이밍(`onChange`, `onClick`)을 외부 API로 노출하지 않는다.
의미 기반 네이밍을 사용한다:

| 용도 | 네이밍 |
|------|--------|
| 값 변경 | `onValueChange` |
| 체크 상태 변경 | `onCheckedChange` |
| 열림/닫힘 | `onOpenChange` |
| 선택 변경 | `onSelectedChange` |

### Feature 컴포넌트 콜백 props

`on + {도메인} + {동사}` 순서로 작성한다:

```tsx
// ✅ 올바른 패턴
onPostTitleChange: (value: string) => void;
onTagRemove: (tag: string) => void;

// ❌ 잘못된 패턴
onChangeTitlePost: (value: string) => void;  // 동사가 앞에
handleTagChange: () => void;                 // handle* 접두어
```

훅에서 외부로 노출하는 함수도 동일 — `handle*` 접두어 대신 목적이 명확한 동사형:
```tsx
// ✅
submitPost, removeTag, openSearch
// ❌
handleSubmit, handleRemove, handleOpen
```

---

## 5. 스타일 / Variants

- `cva` + `cn` 조합을 기본으로 사용한다
- import: `import { cn, cva, type VariantProps } from '@/commons/lib'`
- Emotion(`@emotion/styled`, `css`)은 신규 코드에서 사용하지 않는다
- `disabled`는 opacity 축소 대신 명시된 비활성 스타일(gray 배경/텍스트/보더)로 표현한다
- `invalid`는 props/API로 노출하고, `data-invalid`/`aria-invalid` 상태 기반 스타일을 제공한다

```tsx
const buttonVariants = cva('base-classes', {
  variants: {
    variant: {
      primary: '...',
      secondary: '...',
      ghost: '...',
    },
    size: {
      sm: '...',
      md: '...',
      lg: '...',
    },
    disabled: {
      true: 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed',
    },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
});
```

---

## 6. data-slot 속성

DOM 식별 및 스타일 타겟팅을 위해 `data-slot` 속성을 부여한다:

```tsx
<div data-slot="dialog" ...>
  <div data-slot="dialog-header" ...>
  <div data-slot="dialog-content" ...>
  <div data-slot="dialog-footer" ...>
```

---

## 7. ARIA / 접근성

| 패턴 | 사용 |
|------|------|
| 선택형 그룹 | `role="group"` (root) + `role="radio"` + `aria-checked` (item) |
| 비활성화 | `aria-disabled` (root) + `disabled` (item button) |
| 시각적 전용 | `aria-hidden` (인디케이터 등 장식 요소) |

---

## 8. 컴포넌트 분리 기준

| 판단 기준 | 분리 위치 |
|----------|----------|
| 기능을 담고, feature 도메인에 종속 | `features/{domain}/ui/` |
| 여러 feature에서 재사용 가능 | `modules/` |
| 비즈니스 로직 없는 순수 UI | `commons/ui/` |
| 페이지 전용이지만 독립 기능 단위 | `pages/{page}/ui/` 내 서브 컴포넌트 |

## 9. commons/ui 기반 컴포넌트 네이밍

`commons/ui`의 기본 컴포넌트를 기반으로 만든 기능 컴포넌트는 **suffix에 기반 UI 이름을 붙인다.**

```
{기능명}{BaseUI}.tsx
```

| 기반 UI | 예시 |
|--------|------|
| `Dialog` | `DeleteConfirmDialog.tsx`, `ImagePreviewDialog.tsx` |
| `Drawer` | `FilterDrawer.tsx`, `MenuDrawer.tsx` |
