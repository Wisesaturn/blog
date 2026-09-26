# Blog

## Commands

```bash
pnpm dev          # 개발 서버 (React Router)
pnpm build        # 프로덕션 빌드
pnpm start        # 프로덕션 서버
pnpm lint         # ESLint 검사
pnpm typecheck    # TypeScript 타입 검사
pnpm test         # Vitest 실행
pnpm test:watch   # Vitest watch 모드
pnpm storybook    # Storybook 개발 서버
```

## Tech Stack

- **Framework**: React Router v7 (framework mode, Vite). 상세 페이지는 prerender 하고 나머지는 SSR 이다
- **Language**: TypeScript 5, React 19
- **Package Manager**: pnpm
- **CMS**: Notion (`@notionhq/client`, `notion-to-md`)
- **Styling**: Tailwind CSS v4 + clsx + tailwind-merge → `cn()` 유틸, cva (class-variance-authority)
- **Animation**: motion (`motion/react` 에서 import 한다. `framer-motion` 은 쓰지 않는다)
- **Database**: Firebase (Firestore + Storage)
- **Data**: 서버 데이터는 loader 가 읽는다. 브라우저에서 부르는 API(조회수)는 TanStack Query 5 로 읽는다
- **Validation**: zod 4 (클라이언트 번들에 들어가는 곳은 `zod/mini`)
- **Lint/Format**: ESLint 9 (flat config) + Prettier
- **Test**: Vitest + Testing Library (jsdom)
- **Component Dev**: Storybook

## Architecture — FSD (Feature-Sliced Design)

```
src/
├── app/            # React Router 루트와 라우팅
│   ├── routes/     # route 파일. loader, meta, headers 를 두고 화면은 pages 에서 가져온다
│   ├── lib/        # formatHeadTags, getContentPaths(sitemap·prerender 경로) 등 라우팅 전용 코드
│   ├── config/     # meta 기본값
│   └── ui/         # Document (<html>, <head>, <body>)
├── pages/          # 페이지 조합. 슬라이스마다 {Page} 컴포넌트 하나를 내보낸다
├── modules/        # 전역 레이아웃 (AppShell: 헤더, 내비게이션, 푸터). FSD 의 widgets 자리다
├── features/       # 사용자 행동 단위 (publish, post-filter, view-count, share, comments, toc, darkmode)
├── entities/       # 비즈니스 엔티티 (post, snippet, project) + Firestore API
└── commons/        # 의존성 없는 공용 코드. FSD 의 shared 자리다
    ├── api/        # firebase.server.ts, notion.server.ts, 브라우저용 postViewCount
    ├── config/     # 앱 상수 (animation, cache, site)
    ├── lib/        # 유틸 함수 (cn, cva, logger, convertString 등)
    ├── model/      # 레이아웃 context, 공용 훅
    ├── types/      # 공통 TypeScript 타입
    ├── ui/         # 재사용 기본 UI 컴포넌트
    └── styles/, assets/
```

**의존 방향**: `app → pages → modules → features → entities → commons`

- alias 는 `@/*` 하나다 (`tsconfig.paths.json`). Vite, Storybook, Vitest 가 모두 이 파일을 읽는다
- route 파일의 default 는 `useLoaderData` 로 읽은 값을 page 에 props 로 넘기는 브리지다. pages 가 app 의 loader 타입을 가져오지 않게 하기 위해서다
- 서버 전용 코드는 `.server` 이름을 쓴다. entities 와 `features/publish` 는 Firestore·Notion 을 부르는 API 를 `index.server.ts` 로, 나머지를 `index.ts` 로 내보낸다. `.server` 모듈이 클라이언트 번들에 섞이면 React Router 가 빌드를 실패시킨다

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
| React Router 규약 파일 | 예외 | `route.tsx`, `loader.ts` |

## Conventions

- `@/*` 가 `src/*` 로 매핑된다. 다른 alias 는 없다
- type import 는 인라인으로 적는다: `import { type Foo } from '...'`
- 슬라이스(pages, modules, features, entities) 밖에서는 `index.ts` 나 `index.server.ts` 를 거쳐 import 한다. commons 는 세그먼트 안의 파일을 바로 가져와도 된다
- Firestore 직접 호출은 `entities/{domain}/api/apis.ts` 에서만 한다. Storage 와 Notion 호출은 `features/publish` 에 있다
- Firebase 싱글턴은 `import { db } from '@/commons/api/firebase.server'` 로 가져온다
- `cn()`, `cva` 는 `@/commons/lib` 에서 가져온다
- 외부에서 들어오는 데이터(Notion, Firestore 문서, 웹훅 본문, 쿼리스트링)는 zod 스키마로 검사한다
- `console.log` 를 쓰지 않는다. `console.warn` 과 `console.error` 만 쓴다

> import 순서, FSD 레이어, public API, 파일 이름은 린트가 막는다. type import 형식과 `console.log` 금지는 규칙이고 자동 검사가 없다.

## ESLint Rules

ESLint 9 이고 `eslint.config.js`(flat config) 를 쓴다. airbnb 계열은 쓰지 않는다.

- **기반**: `@eslint/js` recommended, `typescript-eslint` recommended, `eslint-plugin-import-x`, `eslint-plugin-react`, `eslint-plugin-jsx-a11y`, `eslint-plugin-storybook`, `eslint-plugin-prettier`
- **react-hooks**: `rules-of-hooks`(error), `exhaustive-deps`(warn) 만 켠다. v7 의 나머지 규칙은 React Compiler 용이다
- **import-x/order**: `@/app` → `@/pages` → `@/modules` → `@/features` → `@/entities` → `@/commons` 순 (error)
- **prettier/prettier**: 포맷을 error 로 막는다
- **@typescript-eslint/naming-convention**: interface 와 typeAlias 는 PascalCase, 변수는 camelCase / UPPER_CASE / PascalCase (error)
- **@typescript-eslint/no-unused-vars**: `^_` 로 시작하지 않는 미사용 변수는 warn
- **no-warning-comments**: TODO, FIXME, XXX, BUG, HOLD 를 warn
- **no-nested-ternary**, **eqeqeq**: airbnb 에서 받던 것을 직접 켰다 (error)
- **eslint-plugin-fsd-lint**: `forbidden-imports`(상위에서 하위로만), `no-cross-slice-dependency`, `no-public-api-sidestep`(`index.server.ts` 도 public API 로 본다), `no-relative-imports`(같은 슬라이스는 허용), `no-ui-in-business-logic`. 레이어 폴더 이름은 `fsdOptions` 가 widgets → modules, shared → commons 로 잇는다
- **eslint-plugin-check-file**: `*.tsx` 는 PascalCase, `*.ts` 는 camelCase, `src/` 하위 폴더는 kebab-case. `.test`, `.stories`, `.server` 같은 중간 확장자는 보지 않는다. `app/routes` 와 `root`, `entry.*` 는 예외

> **`no-console` 은 켜져 있지 않다.** 규칙으로는 `console.log` 를 금지하지만 린트가 막지 않는다.
> **`consistent-type-imports` 는 설정되어 있지 않다.** 인라인 type import 도 규칙일 뿐 강제되지 않는다.

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
@.claude/rules/testing.md

## 세션 실수 기록

과거 세션에서 반복된 실수 패턴을 담고 있으며, 같은 실수를 되풀이하지 않기 위해 작업 전 참고한다.

@.claude/mistakes/
