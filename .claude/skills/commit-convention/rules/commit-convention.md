# 커밋 컨벤션

## 형식

```
{type}/#{이슈번호}: {한 줄 요약}

- 📋 작업 내역

  - {변경 A}
  - {변경 B}

- 💡 설계 이유

  - {왜 이렇게 했는지, 대안 대비 근거}
```

## 이슈 번호

브랜치명에서 추출 — `git branch --show-current`

```
fix/#2  → fix/#2:
feat/#1 → feat/#1:
```

### 이슈 번호가 없는 경우

`{prefix}/#{number}` 패턴이 아닌 브랜치이거나 이슈 없이 작업할 때는 이슈번호를 생략한다.

```
feat: 한 줄 요약
fix: 한 줄 요약
chore: 한 줄 요약
```

## Type

| Type       | 사용 시점                     |
| ---------- | ----------------------------- |
| `feat`     | 새 기능                       |
| `fix`      | 버그 수정                     |
| `refactor` | 동작 변화 없는 구조 개선      |
| `chore`    | 빌드, 설정, 패키지 유지보수   |
| `docs`     | 문서, 주석                    |
| `style`    | 포매팅, 린트 (기능 변화 없음) |
| `test`     | 테스트                        |

## 작성 규칙

- 제목은 마침표 없이 간결하게. 핵심 결과를 `—` 뒤에 붙여도 좋음
- `📋 작업 내역`: 파일/함수 단위로 구체적으로, 중요한 건 자세히
- `💡 설계 이유`: 대안과 선택 근거 — "왜 이걸 골랐는지" 위주
- **Co-Authored-By 추가하지 않음**

## 예시

```
feat/#1: 포스트 좋아요 기능 구현

- 📋 작업 내역

  - `LikeButton` 컴포넌트 생성 — 좋아요 토글 UI
  - `entities/post/api/apis.ts`에 `toggleLike` 함수 추가
  - `useToggleLikeMutation` 훅 추가

- 💡 설계 이유

  - Remix loader 대신 TQ mutation 사용 — 낙관적 업데이트로 UX 개선
  - 클라이언트 상태라 loader 캐시 무효화 없이 처리 가능
```

```
chore: pnpm 기반으로 패키지 매니저 변경

- 📋 작업 내역

  - package-lock.json 제거, pnpm-lock.yaml 생성
  - .npmrc 추가
```
