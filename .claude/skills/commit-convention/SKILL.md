---
name: commit-convention
description: >
  blog 커밋 컨벤션에 맞는 커밋 메시지를 작성한다.
  브랜치명에서 이슈 번호를 자동으로 파악하고,
  작업 내역 + 설계 이유 구조로 커밋을 생성한다.
  설계 이유에는 이 세션에서 오간 결정의 경위를 함께 남긴다.
license: MIT
metadata:
  author: blog
  version: '1.1.0'
---

# commit-convention

blog 커밋 컨벤션 ([전문](rules/commit-convention.md))에 따라 커밋 메시지를 작성하고 커밋한다.

## 실행 절차

**1. 브랜치에서 이슈번호 추출**

```bash
git branch --show-current
# feat/#1 → feat/#1:
# feat/some-feature → feat: (이슈번호 없음)
```

**2. 변경 파일 파악**

```bash
git diff --staged
git status
```

**2-1. 세션 경위 정리**

설계 이유는 diff 만 보고 쓰지 않는다. 이 대화에서 오간 것을 되짚어 적는다.

- 처음 안과 최종 안이 다르면 무엇에서 무엇으로 왜 바뀌었는지
- 사용자가 확인해 준 결정과 그 근거
- 조사해서 알아낸 사실 중 이 선택을 떠받치는 것
- 시도했다가 버린 방법과 버린 이유

diff 에 남지 않는 것이 이 항목의 가치다. 나중에 이 커밋을 여는 사람은 대화를 볼 수 없다.

**3. 메시지 작성 후 커밋**

아래 세 단계를 각각 별도 Bash 호출로 실행한다.

**3-1. 커밋 가드레일 해제** (별도 Bash 호출)

```bash
touch ~/.claude/.commit-convention-active
```

**3-2. 스테이징 및 커밋** (별도 Bash 호출)

```bash
git add {파일}
git commit -m "$(cat <<'EOF'
{type}/#{이슈번호}: {한 줄 요약}

- 📋 작업 내역

  - {변경 A}

- 💡 설계 이유

  - {선택 근거}
EOF
)"
```

**3-3. 가드레일 복원** (별도 Bash 호출)

```bash
rm -f ~/.claude/.commit-convention-active
```

> Co-Authored-By 추가하지 않는다.

## 작성 기준

| 항목         | 기준                                          |
| ------------ | --------------------------------------------- |
| 제목         | 한 줄, 마침표 없음. em dash(`—`)를 쓰지 않는다 |
| 📋 작업 내역 | 파일/함수 단위로 구체적으로, 중요한 건 자세히 |
| 💡 설계 이유 | 대안 대비 이 방법을 고른 근거와 이 세션에서 그 결정에 이른 경위 |
| Co-author    | 포함하지 않음                                 |
