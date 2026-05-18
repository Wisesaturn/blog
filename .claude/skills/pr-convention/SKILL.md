---
name: pr-convention
description: >
  blog PR 컨벤션에 맞는 Pull Request를 생성한다.
  base는 항상 main, diff 분석 후 gh pr create까지 수행한다.
  PR 생성 후 code-review:code-review 스킬로 리뷰하고 결과를 라인 지정 PR Review로 등록한다.
license: MIT
metadata:
  author: blog
  version: '1.0.0'
---

# pr-convention

blog PR 컨벤션 ([전문](rules/pr-convention.md))에 따라 PR 본문을 작성하고 `gh pr create`로 PR을 생성한다.
PR 생성 후 `code-review:code-review` 스킬로 자동 리뷰를 수행하고 결과를 PR 코멘트로 등록한다.

## 실행 절차

**1. 현재 브랜치 및 이슈번호 확인**

```bash
git branch --show-current
# feat/#1 → closes #1
```

**2. diff 분석**

```bash
git diff main...HEAD --stat
git log --oneline --no-merges main..HEAD
```

**3. PR 제목 + 본문 작성** — [rules/pr-convention.md](rules/pr-convention.md) 참고

**4. 브랜치 push**

```bash
export GH_TOKEN=$(gh auth token --user Wisesaturn)
git push -u origin {current-branch}
```

**5. gh pr create 실행**

```bash
export GH_TOKEN=$(gh auth token --user Wisesaturn)
gh pr create \
  --base main \
  --title "{title}" \
  --body "$(cat <<'EOF'
{body}
EOF
)"
```

**6. 코드 리뷰 실행**

PR 생성 직후 `code-review:code-review` 스킬을 호출해 PR을 리뷰한다.

- 리뷰 대상: 생성된 PR 번호 (위 명령 출력 URL에서 추출)
- 검토 항목: 버그, 보안 취약점, 코드 품질, 프로젝트 컨벤션(CLAUDE.md) 준수 여부
- 리뷰 결과는 파일 경로(`path`), 라인 번호(`line`), 코멘트 내용(`body`) 단위로 수집한다

**7. 리뷰 결과를 라인 지정 PR Review로 게시**

```bash
HEAD_SHA=$(git rev-parse HEAD)
export GH_TOKEN=$(gh auth token --user Wisesaturn)
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)

gh api repos/$REPO/pulls/{PR번호}/reviews \
  --method POST \
  --field commit_id="$HEAD_SHA" \
  --field body="## Code Review\n\n{전체 요약}" \
  --field event="COMMENT" \
  --field "comments[][path]"="{파일1}" \
  --field "comments[][line]"={라인1} \
  --field "comments[][body]"="{코멘트1}"
```

> `line`은 diff 내 변경된 라인(+로 표시된 라인)만 지정 가능하다.

### 우선순위 시스템 (P1~P5)

각 line comment body는 맨 위에 GitHub Alert 블록으로 우선순위를 표시한다.

| 우선순위 | Alert 타입 | 의미 |
|---------|-----------|------|
| **P1** | `[!CAUTION]` | 블로킹 — 데이터 손실·보안·크래시·머지 불가 |
| **P2** | `[!WARNING]` | 중요 — 주요 버그·아키텍처 결함 (머지 전 수정 권장) |
| **P3** | `[!IMPORTANT]` | 보통 — 코드 품질·에러 처리·테스트 부족 |
| **P4** | `[!NOTE]` | 낮음 — 스타일·최적화·문서 개선 |
| **P5** | `[!TIP]` | 사소 — 닛픽·선택적 제안 |

> ⚠️ PR 본문, 리뷰 body, line comment 등 모든 출력에 "🤖 Generated with Claude Code" 또는 Claude 귀속 푸터를 절대 추가하지 않는다.
