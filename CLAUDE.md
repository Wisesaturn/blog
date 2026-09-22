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
- **Animation**: framer-motion
- **Database**: Firebase (Firestore + Storage)
- **State**: Remix loader 가 처리한다. 별도 상태 라이브러리는 설치되어 있지 않다
- **Lint/Format**: ESLint 8 + Prettier
- **Component Dev**: Storybook

## Architecture — FSD (Feature-Sliced Design)

> **현재 구조와 목표 구조가 다르다.** 목표 구조는 [#89](https://github.com/Wisesaturn/blog/issues/89) 에서 적용한다.
> 그 전까지 새 코드를 쓸 때는 아래 「현재」의 위치와 alias 를 쓴다.

### 현재

```
src/
├── app/routes/     # Remix route 파일 (실제 구현이 여기 들어 있다)
├── features/       # 도메인 단위 (post, snippet, project, profile, home)
│   └── {domain}/   # api, ui, types, lib, hooks, constant, helper
│                   # ui/ 내부는 atomic design (atoms, molecules, organisms)
├── shared/         # 공유 코드 대부분
│   └── ui, lib, api, middleware, types, styles, constant, hooks, helper, assets
└── commons/        # lib, model 일부만 있다
```

- alias: `$app/*`, `$features/*`, `$shared/*`, `@/*` (`tsconfig.paths.json`)
- `$pages/*` 가 alias 에 정의되어 있으나 `src/pages/` 는 없다
- `pages/`, `modules/`, `entities/` 레이어는 아직 없다
- Firestore 직접 호출은 `features/{domain}/api/` 에 있다

### 목표 (#89)

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

> `shared/`, `widgets/` 레이어는 목표 구조에서 쓰지 않는다. `shared/` 는 `commons/` 로 옮긴다.

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

### 지금 지키는 것

- `@/*` 는 `src/*` 로 매핑된다. `$app/*`, `$features/*`, `$shared/*` 도 함께 쓰이는데 legacy 다. 새 코드는 `@/*` 를 쓴다
- type import 는 인라인으로 적는다: `import { type Foo } from '...'`
- 슬라이스 public API 는 `index.ts` 를 거쳐 import 한다
- `console.log` 를 쓰지 않는다. `console.warn` 과 `console.error` 만 쓴다
- import 순서는 `import/order` 가 강제한다

> 위 네 가지 중 `import/order` 만 린트가 막는다. 나머지는 규칙이고 자동 검사가 없다. [#89](https://github.com/Wisesaturn/blog/issues/89) 에서 린트로 옮긴다.

### #89 이후 지킬 것

- alias 를 `@/*` 로 통일한다. `$*` alias 는 그때 없어진다
- Firestore 직접 호출은 `entities/{domain}/api/apis.ts` 에서만 허용한다. 지금은 `features/{domain}/api/` 에 있다
- Firebase 싱글턴을 `import { db } from '@/commons/api'` 로 가져온다. 지금은 `$shared/middleware/firebase` 다
- `cn()`, `cva` 를 `@/commons/lib` 에서 가져온다

## ESLint Rules

ESLint 8 이고 `.eslintrc.cjs` 를 쓴다. flat config 전환과 아래 「목표」 플러그인 도입은 [#89](https://github.com/Wisesaturn/blog/issues/89) 에서 한다.

### 지금 켜져 있는 것

- **extends**: `airbnb-base`, `eslint-config-prettier`. 파일 종류별로 react, jsx-a11y, react-hooks, @typescript-eslint, import, storybook 을 override 로 얹는다
- **import/order**: `@/app` → `@/pages` → `@/modules` → `@/features` → `@/entities` → `@/commons` → `$*`(legacy) 순 (error)
- **prettier/prettier**: 포맷을 error 로 막는다
- **@typescript-eslint/naming-convention**: interface 와 typeAlias 는 PascalCase, 변수는 camelCase / UPPER_CASE / PascalCase (error)
- **@typescript-eslint/no-unused-vars**: `^_` 로 시작하지 않는 미사용 변수는 warn
- **no-warning-comments**: TODO, FIXME, XXX, BUG, HOLD 를 warn
- **no-nested-ternary**, **eqeqeq**: `airbnb-base` 에서 상속

> **`no-console` 은 `'off'` 다.** 규칙으로는 `console.log` 를 금지하지만 린트가 막지 않는다.
> **`consistent-type-imports` 는 설정되어 있지 않다.** 인라인 type import 도 규칙일 뿐 강제되지 않는다.

### 목표 (#89)

아래 플러그인은 **아직 설치되어 있지 않다.**

- **eslint-plugin-fsd-lint**: `fsd/forbidden-imports`(상위에서 하위로만 import), `fsd/no-relative-imports`, `fsd/no-public-api-sidestep`, `fsd/no-cross-slice-dependency`, `fsd/no-ui-in-business-logic`
- **eslint-plugin-check-file**: `*.tsx` 는 PascalCase, `*.ts` 는 camelCase, `src/` 하위 폴더는 kebab-case. Remix 규약 파일은 예외

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
