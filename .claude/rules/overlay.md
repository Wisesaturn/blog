# overlay-kit 사용 규칙

Dialog, Drawer 등 오버레이 UI가 필요할 때는 **overlay-kit** 기반으로 열어야 한다.

## 원칙

컴포넌트 트리에 `<SomeDialog open={state} />` 를 인라인으로 두지 않는다.
`overlay.open()`으로 열고, 다이얼로그 컴포넌트는 별도 파일로 분리한다.

## 패턴

### 1. 다이얼로그 컴포넌트 — `overlay.open()` 전용 설계

```tsx
// features/{domain}/ui/FooConfirmDialog.tsx
interface FooConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function FooConfirmDialog({ isOpen, onClose, onConfirm }: FooConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      ...
    </Dialog>
  );
}
```

### 2. 호출부 — `overlay.open()`

```tsx
import { overlay } from 'overlay-kit';

function handleDelete() {
  overlay.open(({ isOpen, close }) => (
    <FooConfirmDialog
      isOpen={isOpen}
      onClose={close}
      onConfirm={() => {
        close();
        // 실제 동작
      }}
    />
  ));
}
```

## 파일 위치

다이얼로그 컴포넌트는 호출하는 슬라이스 내부 `ui/` 에 둔다.

```
features/post-delete/ui/
├── PostDeleteButton.tsx
└── PostDeleteConfirmDialog.tsx   ← overlay.open()으로 열리는 다이얼로그
```

## 규칙 요약

- Dialog를 여는 state(`showDialog`, `isOpen`)를 부모 컴포넌트에 두지 않는다
- `overlay.open()` 호출부에 JSX를 인라인으로 쓰지 않고 별도 컴포넌트를 넘긴다
- Drawer도 동일 패턴 적용
