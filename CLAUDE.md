# Blog

## Commands

```bash
pnpm dev          # 개발 서버 (Remix)
pnpm build        # 프로덕션 빌드
pnpm start        # 프로덕션 서버
pnpm lint         # ESLint 검사
pnpm typecheck    # TypeScript 타입 검사
pnpm storybook    # Storybook 개발 서버
```

## Tech Stack

- **Framework**: Remix (React Router v6)
- **Language**: TypeScript 5, React 18
- **Package Manager**: pnpm
- **CMS**: Notion (`@notionhq/client`, `notion-to-md`)
- **Styling**: Tailwind CSS + clsx + tailwind-merge → `cn()` 유틸, cva (class-variance-authority)
- **Emotion**: 레거시 코드만 유지 — 신규 코드에서는 사용 금지
- **Database**: Firebase (Firestore + Storage)
- **State**: @tanstack/react-query (클라이언트사이드 fetch 전용 — Remix loader가 처리하는 데이터는 TQ 사용 안 함)
- **Lint/Format**: ESLint 8 + Prettier
- **Component Dev**: Storybook

## Architecture — FSD (Feature-Sliced Design)

```
src/
├── app/            # Remix 라우팅 전용 (routes/ 파일은 src/pages/ import 브릿지)
│   └── routes/     # Remix route 파일
├── pages/          # 페이지 조합 레이어
├── modules/        # 전역 레이아웃 컴포넌트 (Header, Footer, Nav 등)
├── features/       # 사용자 행동 단위 (검색, 좋아요, 댓글 등)
├── entities/       # 비즈니스 엔티티 + Firebase API 함수
└── commons/        # 공유 코드 (의존성 없음)
    ├── api/        # Firebase 싱글턴 초기화만 (auth, db export)
    ├── config/     # 환경변수, 앱 상수
    ├── lib/        # 유틸 함수 (cn.ts 등)
    ├── types/      # 공통 TypeScript 타입
    └── ui/         # 재사용 기본 UI 컴포넌트
```

**의존 방향**: `app → pages → modules → features → entities → commons`

> `shared/`, `widgets/` 레이어는 사용하지 않는다.

## Naming Conventions

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 파일 `.tsx` | PascalCase | `PostCard.tsx` |
| 함수/유틸 파일 `.ts` | camelCase | `useAuth.ts`, `cn.ts` |
| 폴더 | kebab-case | `post-card/`, `snippet-form/` |
| 컴포넌트 | PascalCase | `PostCard` |
| 함수/변수 | camelCase | `createPost` |
| 상수 | UPPER_SNAKE_CASE | `MAX_POST_COUNT` |
| 타입/인터페이스 | PascalCase | `PostDocument` |
| Remix 규약 파일 | 예외 | `route.tsx`, `loader.ts` |

## Conventions

- `@/*`는 `src/*`로 매핑 (tsconfig paths)
- `cn()`, `cva` import: `import { cn, cva, type VariantProps } from '@/commons/lib'`
- type import는 인라인 스타일 사용: `import { type Foo } from '...'`
- Firebase 싱글턴: `import { db } from '@/commons/api'`
- Firestore `getDoc`, `collection`, `setDoc` 등 직접 호출은 **반드시 `entities/{domain}/api/apis.ts`에서만** 허용
- TanStack Query 조건부 실행: `enabled` 대신 `queryFn`에 `skipToken` 사용
- `console.log` 금지 — `console.warn` / `console.error`만 허용
- 슬라이스 public API는 반드시 `index.ts`를 통해 import
- Emotion(`@emotion/styled`, `css`) 신규 코드 사용 금지

## ESLint Rules

### FSD Architecture (eslint-plugin-fsd-lint)

- **fsd/forbidden-imports**: 상위→하위 단방향 import만 허용 (error)
- **fsd/no-relative-imports**: 크로스 슬라이스 상대경로 import 금지, 같은 슬라이스 내부는 허용 (error)
- **fsd/no-public-api-sidestep**: pages/features/entities/modules는 반드시 index.ts를 통해 import (error)
- **fsd/no-cross-slice-dependency**: 같은 레이어 내 슬라이스 간 직접 import 금지 (error)
- **fsd/no-ui-in-business-logic**: 비즈니스 로직 레이어에서 UI import 금지 (error)

### Naming (eslint-plugin-check-file)

- **check-file/filename-naming-convention**: `*.tsx` → PascalCase, `*.ts` → camelCase 강제 (error), Remix 규약 파일 예외
- **check-file/folder-naming-convention**: `src/` 하위 폴더는 kebab-case 강제 (error)

### Code Quality

- **import/order**: external → @/pages → @/modules → @/features → @/entities → @/commons → parent → sibling
- **consistent-type-imports**: 인라인 type import 강제
- **no-console**: warn/error만 허용
- **no-nested-ternary**: 중첩 삼항 금지
- **eqeqeq**: === 강제

## Git 커밋 규칙

**커밋은 반드시 사용자가 검토·승인한 후에만 실행한다.**
코드 작업이 끝나면 변경 내용을 보여주고 사용자 확인을 받은 뒤 커밋한다.
플랜이나 작업 흐름에 커밋 단계가 포함되어 있어도 실행 전 사용자 승인이 우선이다.

## 설계 규칙

@.claude/rules/fsd-instructure.md
@.claude/rules/api-interface.md
@.claude/rules/component-design.md
@.claude/rules/jsdoc.md
@.claude/rules/overlay.md
@.claude/rules/database.md

## 세션 실수 기록

과거 세션에서 반복된 실수 패턴을 담고 있으며, 같은 실수를 되풀이하지 않기 위해 작업 전 참고한다.

@.claude/mistakes/
