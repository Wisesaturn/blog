---
name: write-release-note
description: blog 의 다음 버전을 정하고 package.json 버전 커밋, GitHub 릴리즈 노트 작성과 발행까지 한다.
disable-model-invocation: true
license: MIT
---

# write-release-note

## 절차

**1. 범위 확인**

```bash
export GH_TOKEN=$(gh auth token --user Wisesaturn)
BASE=$(gh repo view --json defaultBranchRef -q .defaultBranchRef.name)
PREV=$(gh release view --json tagName -q .tagName)   # 현재 Latest
git log --no-merges --format='%h %s' "$PREV..origin/$BASE"
```

- 커밋 제목의 `#N` 으로 이슈, PR 본문을 읽어 바뀐 동작을 파악한다
- 완료: 커밋마다 어느 섹션에 들어갈지(또는 뺄지) 정해졌다

**2. 버전 결정** (`vMAJOR.MINOR.PATCH`)

- PATCH: 버그 수정, 자잘한 표시 변경만 있다
- MINOR: 새 기능이 있다
- MAJOR: 구조나 스택 개편 (v2 → v3 같은 에픽 단위)
- 사용자에게 버전을 확인받는다

**3. 버전 커밋**

- `package.json` 의 `version` 을 올린다. 푸터 버전 표시와 릴리즈 링크가 이 값을 읽는다
- 제목 `chore: package.json 버전을 X.Y.Z 로 올림`, 본문은 `/commit-convention` 형식
- 커밋과 push 는 사용자 승인 뒤에 한다. 기본 브랜치에 바로 올리라는 지시가 없으면 PR 로 올린다
- 완료: 버전 커밋이 origin 의 기본 브랜치에 있다

**4. 본문 작성**

- 아래 「본문 형식」대로 scratchpad 에 `release-vX.Y.Z.md` 로 쓴다
- 사용자가 draft 를 요청했으면 여기서 보여주고 승인을 받는다

**5. 발행**

```bash
SHA=$(git rev-parse <버전 커밋>)   # 짧은 SHA 는 거부된다
gh release create vX.Y.Z --target "$SHA" --title vX.Y.Z --notes-file release-vX.Y.Z.md --latest
git fetch --tags && git rev-parse --short vX.Y.Z^{commit}
```

- `--target` 은 항상 버전 커밋의 전체 SHA 로 준다. 브랜치 이름으로 draft 를 만들면 GitHub 이 그 시점 커밋에 태그를 먼저 만들어, 뒤에 들어간 커밋이 빠진다 (v3.0.0 에서 겪음)
- 완료: 태그가 버전 커밋을 가리키고, 릴리즈 목록에서 Latest 다

## 본문 형식

```markdown
## Feature
### {바뀐 것 한 줄 제목}
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

**Full Changelog**: https://github.com/Wisesaturn/blog/compare/{PREV}...vX.Y.Z
```

- 해당 없는 섹션은 뺀다. `To do` 는 남은 일이 있을 때만 쓴다
- 문장은 `~습니다` 체로 쓴다
- 독자는 블로그를 보는 사람이다. 파일과 함수 이름 대신 달라진 동작을 적는다. 코드 이름은 꼭 필요할 때만 백틱으로 쓴다
- 관련 이슈는 제목 끝에 `(#N)` 으로 붙인다
- 이전 릴리즈와 이어지는 내용은 그 버전을 짚어 준다 (예: "v2.0.0-beta 때 적어 두었던 …")
