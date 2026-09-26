---
name: write-release-note
description: release 워크플로가 PR 하나로 자동 발행한 GitHub 릴리즈 노트를 손으로 다시 쓴다. 에픽 단위 major 릴리즈처럼 여러 PR 을 묶어 설명해야 할 때 쓴다.
disable-model-invocation: true
license: MIT
---

# write-release-note

버전과 태그, 릴리즈 발행은 자동이다 (`CLAUDE.md` 「버전 관리」). 이 스킬은 **이미 발행된 릴리즈의 본문만** 고친다. `package.json` 버전 커밋, 태그 생성, 새 릴리즈 발행은 하지 않는다.

## 절차

**1. 대상 릴리즈 확인**

```bash
export GH_TOKEN=$(gh auth token --user Wisesaturn)
gh release list --limit 5
TAG=vX.Y.Z   # 고칠 릴리즈
PREV=$(git tag --list 'v*' --sort=-v:refname | grep -E '^v[0-9]+\.[0-9]+\.[0-9]+$' | grep -A1 -x "$TAG" | tail -1)
gh release view "$TAG" --json body -q .body
```

- 완료: 고칠 태그와 직전 태그, 지금 본문을 확인했다

**2. 범위 확인**

```bash
git log --no-merges --format='%h %s' "$PREV..$TAG"
```

- 커밋 제목의 `#N` 으로 이슈, PR 본문을 읽어 바뀐 동작을 파악한다
- 완료: 커밋마다 어느 섹션에 들어갈지(또는 뺄지) 정해졌다

**3. 본문 작성**

- 아래 「본문 형식」대로 scratchpad 에 `release-$TAG.md` 로 쓴다
- 사용자에게 보여주고 승인을 받는다

**4. 본문 교체**

```bash
gh release edit "$TAG" --notes-file "release-$TAG.md"
```

- 태그와 대상 커밋은 건드리지 않는다
- 완료: `gh release view "$TAG"` 의 본문이 새 내용이다

## 본문 형식

자동 노트(`.github/scripts/buildReleaseNotes.ts`)와 같은 형식이다.

```markdown
## Feature
### {바뀐 것 한 줄 제목} (#N)
- {무엇이 바뀌었고 왜 바꿨는지}

## Fix
### {고친 문제} (#N)
- {어떤 증상이었고 원인이 무엇이었는지}
- {이제 어떻게 동작하는지}

## Etc
- {자잘한 변경}

---

### To do
- [ ] {다음에 할 일}

**Full Changelog**: https://github.com/Wisesaturn/blog/compare/{PREV}...{TAG}
```

- 해당 없는 섹션은 뺀다. `To do` 는 남은 일이 있을 때만 쓴다
- 문장은 `~습니다` 체로 쓴다
- 독자는 블로그를 보는 사람이다. 파일과 함수 이름 대신 달라진 동작을 적는다. 코드 이름은 꼭 필요할 때만 백틱으로 쓴다
- 관련 이슈나 PR 은 소제목 끝에 `(#N)` 으로 붙인다
- 이전 릴리즈와 이어지는 내용은 그 버전을 짚어 준다 (예: "v2.0.0-beta 때 적어 두었던 …")
