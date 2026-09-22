---
name: pr-convention
description: >
  blog PR 컨벤션에 맞는 Pull Request를 생성한다.
  diff 분석, gh pr create 까지 수행한다.
  PR 생성 후 code-review:code-review 스킬로 리뷰하고 결과를 라인 지정 PR Review로 등록한다.
license: MIT
metadata:
  author: blog
  version: '1.1.0'
---

# pr-convention

blog PR 컨벤션 ([전문](rules/pr-convention.md))에 따라 PR 본문을 작성하고 `gh pr create`로 PR을 생성한다.
PR 생성 후 `code-review:code-review` 스킬로 자동 리뷰를 수행하고 결과를 PR 코멘트로 등록한다.

## gh 계정 확인

이 레포는 개인 계정(`Wisesaturn`)이다. `gh` 를 처음 쓰기 전에 `gh auth status` 로 현재 계정을 확인한다.
이미 `Wisesaturn` 이면 아무것도 하지 않는다. 다른 계정이 활성 상태이고 `Wisesaturn` 토큰이 이 머신에 있으면 `export GH_TOKEN=$(gh auth token --user Wisesaturn)` 로 덮어쓴다.
토큰이 없으면 사용자에게 `gh auth login` 을 요청한다. `gh auth switch` 는 전역 설정을 바꾸므로 쓰지 않는다.

## 실행 절차

**1. base 브랜치와 닫을 이슈 번호 확보**

base 브랜치를 고정값으로 적지 않는다. 현재 값을 확인해서 쓴다.

```bash
BASE=$(gh repo view --json defaultBranchRef -q .defaultBranchRef.name)
git branch --show-current
```

브랜치명에 `#N` 이 있으면 그 번호를 닫는다. 브랜치 하나에서 sub-issue 여럿을 처리했으면 **커밋 제목에서 번호를 모은다.**

```bash
git log --no-merges --format=%s "$BASE"..HEAD | grep -o "#[0-9]*" | sort -u
```

모인 번호를 본문에 `closes #N` 으로 각각 적는다.

**2. diff 분석**

```bash
git diff "$BASE"...HEAD --stat
git log --oneline --no-merges "$BASE"..HEAD
```

**3. PR 제목 + 본문 작성** ([rules/pr-convention.md](rules/pr-convention.md) 참고)

**4. 브랜치 push**

```bash
git push -u origin {current-branch}
```

**5. gh pr create 실행**

```bash
gh pr create \
  --base "$BASE" \
  --title "{title}" \
  --body "$(cat <<'EOF'
{body}
EOF
)"
```

**6. 코드 리뷰 실행**

PR 생성 직후 `code-review:code-review` 스킬을 호출해 PR을 리뷰한다.

- 리뷰 대상: 생성된 PR 번호 (위 명령 출력 URL에서 추출)
- 검토 항목: 버그, 보안 취약점, 코드 품질, 프로젝트 컨벤션(CLAUDE.md, `.claude/rules/**`) 준수 여부
- **닫으려는 이슈 본문을 `gh issue view {번호}` 로 읽어 요구와 완료 조건을 뽑는다.** 그 요구를 만족했는지도 리뷰 항목에 넣는다
- 리뷰 결과는 파일 경로(`path`), 라인 번호(`line`), 코멘트 내용(`body`) 단위로 모은다

**7. 리뷰 결과를 라인 지정 PR Review로 게시**

코멘트 본문에 코드 블록과 개행이 들어가므로 `--field` 로 넘기지 않는다. JSON 파일로 만들어 `--input` 으로 한 번에 올린다.

```json
{
  "commit_id": "{HEAD SHA}",
  "body": "## Code Review\n\n{전체 요약}",
  "event": "COMMENT",
  "comments": [
    { "path": "{파일1}", "line": {라인1}, "body": "{코멘트1}" }
  ]
}
```

```bash
HEAD_SHA=$(git rev-parse HEAD)
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)

# review.json 을 만든 뒤
gh api "repos/$REPO/pulls/{PR번호}/reviews" --method POST --input review.json
```

> `line` 은 diff 내 변경된 라인(`+` 로 표시된 라인)만 지정할 수 있다.
> `event` 는 `COMMENT` 로 고정한다. 자기 PR 이라 GitHub 이 `APPROVE` 와 `REQUEST_CHANGES` 를 막는다.

### 우선순위 시스템 (P1~P5)

각 line comment body는 맨 위에 GitHub Alert 블록으로 우선순위를 표시한다.

| 우선순위 | Alert 타입 | 의미 |
|---------|-----------|------|
| **P1** | `[!CAUTION]` | 블로킹. 데이터 손실과 보안, 크래시, 머지 불가 |
| **P2** | `[!WARNING]` | 중요. 주요 버그와 아키텍처 결함 (머지 전 수정 권장) |
| **P3** | `[!IMPORTANT]` | 보통. 코드 품질과 에러 처리, 테스트 부족 |
| **P4** | `[!NOTE]` | 낮음. 스타일과 최적화, 문서 개선 |
| **P5** | `[!TIP]` | 사소. 닛픽과 선택적 제안 |

> ⚠️ PR 본문, 리뷰 body, line comment 등 모든 출력에 "🤖 Generated with Claude Code" 또는 Claude 귀속 푸터를 절대 추가하지 않는다.
