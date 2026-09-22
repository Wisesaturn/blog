# GitHub 이슈 작성 가이드 (Wisesaturn/blog)

필요한 섹션만 골라 읽는다.

- **이슈 제목 규칙**: 유형 구분 기준과 종결 어미. 유형을 정하고 제목을 쓸 때.
- **레이블**: 유형과 레이블 매핑. 발행 명령에 넣을 값.
- **공통 템플릿**: 모든 유형이 쓰는 본문 4블록. 에픽은 한 블록을 더 쓴다.
- **gh CLI 명령어 패턴**: 생성, sub-issue 연결, 브랜치.

---

## 이슈 제목 규칙

| 유형 | 종결 형태 | 예시 | 구분 기준 |
| --- | --- | --- | --- |
| 기능 구현 | `~를 구현한다` / `~를 추가한다` | `포스트 좋아요 기능을 구현한다` | 없던 기능을 새로 넣는다 |
| 상태 개선 | `~해야 한다` / `~를 조정한다` | `삭제 후 목록이 즉시 갱신되어야 한다` | 사용자가 체감하는 동작이 달라진다 |
| 버그 | `~현상이 발생한다` / `~문제가 있다` | `상세 페이지에 meta tag 가 주입되지 않는 문제가 있다` | 의도하지 않은 오동작 |
| 리팩토링 | `~로 전환한다` / `~구조를 개선한다` | `빌드를 Vite 로 전환한다` | 외부 동작은 그대로, 내부 구조만 바뀐다 |
| 핫픽스 | `~를 긴급 수정한다` | `sitemap 500 에러를 긴급 수정한다` | 운영 중 장애 |
| 에픽 | `~를 개편한다` / `~로 전환한다` | `블로그를 v3 으로 개편한다` | sub-issue 를 묶는 상위 단위 |

### 작성 원칙

- 마침표 없이 끝낸다
- 영문 고유명사는 원문 그대로 쓴다. `Vite`, `React Router`, `Firestore`, `Notion`
- 30자 내외로 줄인다

---

## 레이블

이 레포에는 `.github/labeler.yml` 이 없다. 본문 헤더로 자동 부여되지 않으므로 `--label` 로 직접 지정한다.

| 유형 | 레이블 |
| --- | --- |
| 기능 구현 | `✨ Feat` |
| 상태 개선 | `✨ Fix` |
| 버그 | `👻 Bug` |
| 리팩토링 | `♻️ Refactor` |
| 핫픽스 | `😎 Hotfix` |
| 에픽 | `🎗 Epic` |
| 배포 | `📃 Release` |

---

## 공통 템플릿

유형과 무관하게 이 4블록을 쓴다. 유형은 레이블로만 구분한다.

```markdown
## 배경

왜 이 작업이 필요한지 적는다. 확인한 사실만 쓰고 추측한 이유는 쓰지 않는다.

## 작업 범위

무엇을 바꾸는지 적는다. 파일 경로와 함수 이름을 그대로 쓴다.

## 완료 조건

- [ ] 체크 가능한 문장으로 적는다
- [ ] 판정할 수 없는 표현을 쓰지 않는다

## 선행 의존

blocked by #N
```

선행 의존이 없으면 `없음` 이라고 적는다.

### 완료 조건 쓰는 법

무엇이 되면 끝인지 사람이 보고 판정할 수 있어야 한다. 판정이 갈리는 문장은 쓰지 않는다.

| 쓰지 않음 | 대신 |
| --- | --- |
| 정상 동작 확인 | `pnpm build` 성공 |
| 빌드 개선 | `remix.config.js` 의 `serverDependenciesToBundle` 제거 |
| 배포 확인 | Vercel 프리뷰에서 글 상세와 목록이 렌더됨 |

### 에픽은 한 블록을 더 쓴다

```markdown
## 작업 목록

- [ ] #N 제목
- [ ] #N 제목
```

sub-issue 를 연결하면 GitHub 가 진행률을 자동으로 보여준다. 이 목록은 **순서를 보여주는 용도**로 적는다.

---

## gh CLI 명령어 패턴

이 레포는 개인 계정(`Wisesaturn`)이다. `gh` 명령을 쓰기 전에 현재 계정이 `Wisesaturn` 인지 확인한다.

```bash
gh auth status
```

이미 `Wisesaturn` 이면 아무것도 하지 않는다. 다른 계정이 활성 상태이고 `Wisesaturn` 토큰이 이 머신에 있으면 `GH_TOKEN` 으로 덮어쓴다. `gh auth switch` 는 전역 설정을 바꾸므로 쓰지 않는다.

```bash
export GH_TOKEN=$(gh auth token --user Wisesaturn)
```

토큰이 없으면 사용자에게 `gh auth login` 을 요청한다.

### 이슈 생성

```bash
gh issue create \
  --repo Wisesaturn/blog \
  --title "빌드를 Vite 로 전환한다" \
  --label "♻️ Refactor" \
  --body "$(cat <<'EOF'
본문
EOF
)"
```

### sub-issue 연결

에픽과 자식을 모두 만든 뒤, 자식의 **REST id** 로 붙인다. 이슈 번호가 아니다.

```bash
PARENT={에픽 이슈번호}
CHILD_ID=$(gh api repos/Wisesaturn/blog/issues/{자식 이슈번호} --jq .id)
gh api --method POST \
  repos/Wisesaturn/blog/issues/$PARENT/sub_issues \
  -F sub_issue_id=$CHILD_ID
```

### 브랜치

기본 브랜치를 고정값으로 적지 않는다. 현재 값을 확인해서 쓴다.

```bash
gh repo view Wisesaturn/blog --json defaultBranchRef -q .defaultBranchRef.name
```

작업 브랜치는 이슈 번호를 담는다. commit-convention 과 pr-convention 이 이 패턴에서 번호를 뽑는다.

```bash
git checkout -b refactor/#{번호}
git checkout -b feat/#{번호}
```
