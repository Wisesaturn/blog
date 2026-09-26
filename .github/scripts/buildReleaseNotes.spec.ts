import { describe, expect, it } from 'vitest';

import {
  buildReleaseNotes,
  extractWorkSection,
  formatHeadings,
  getSection,
} from './buildReleaseNotes';

/**
 * `buildReleaseNotes` 는 머지된 PR 본문으로 GitHub 릴리즈 노트를 만든다.
 *
 * 워크플로는 결과를 그대로 발행하므로 여기서 틀려도 에러가 나지 않는다. 검증 결과나 체크박스가 노트에
 * 섞이거나, 작업 내용이 통째로 빠진 노트가 조용히 나간다. 노트 형식은 손으로 쓴 v3.0.0, v3.0.1 과 같아야 한다.
 */

const BODY = `## Pull Request Type

- [x] fix: 버그 수정

## 관련 이슈

closes #104

## 작업 내용

### 1. 옛 파일 정리를 저장 뒤로 옮김

- 발행이 실패해도 운영 이미지가 남습니다.

### 2. 이미지가 아닌 응답을 막음

- 404 면 원인이 보이는 에러를 냅니다.

## 검증

- 로컬에서 확인했습니다
`;

describe('getSection 은 PR 제목 타입으로 노트 섹션을 정한다', () => {
  it.each([
    ['feat: 검색 추가', 'Feature'],
    ['feat!: v4 개편', 'Feature'],
    ['fix: 이미지 보존', 'Fix'],
    ['style: 푸터 버전', 'Etc'],
    ['refactor: 구조 변경', 'Etc'],
    ['제목 형식이 아님', 'Etc'],
  ])('"%s" 는 %s', (title, section) => {
    expect(getSection(title)).toBe(section);
  });
});

describe('extractWorkSection 은 작업 내용 절만 꺼낸다', () => {
  it('다음 ## 제목 앞에서 멈춰 검증 절이 섞이지 않는다', () => {
    const section = extractWorkSection(BODY);
    expect(section).toContain('### 2. 이미지가 아닌 응답을 막음');
    expect(section).not.toContain('## 검증');
    expect(section).not.toContain('closes #104');
  });

  it('작업 내용이 마지막 절이면 본문 끝까지 꺼낸다', () => {
    expect(extractWorkSection('## 작업 내용\n\n### 제목\n\n- 내용')).toBe('### 제목\n\n- 내용');
  });

  it('CRLF 본문도 읽는다', () => {
    expect(extractWorkSection('## 작업 내용\r\n\r\n- 내용\r\n## 검증')).toBe('- 내용');
  });

  it.each([
    ['절이 없다', '## 관련 이슈\n\ncloses #1'],
    ['절이 비었다', '## 작업 내용\n\n## 검증\n\n- 확인'],
  ])('%s 면 null 이다', (_, body) => {
    expect(extractWorkSection(body)).toBeNull();
  });
});

describe('formatHeadings 는 소제목을 노트 형식으로 바꾼다', () => {
  it('번호를 떼고 끝에 PR 번호를 붙인다', () => {
    expect(formatHeadings('### 1. 옛 파일 정리\n\n- 내용', 105)).toBe(
      '### 옛 파일 정리 (#105)\n\n- 내용',
    );
  });

  it('번호가 없는 소제목에도 PR 번호를 붙인다', () => {
    expect(formatHeadings('### 푸터 버전 표시', 111)).toBe('### 푸터 버전 표시 (#111)');
  });

  it('#### 이하나 본문의 # 은 건드리지 않는다', () => {
    const text = '#### 세부\n- #104 참고';
    expect(formatHeadings(text, 1)).toBe(text);
  });
});

describe('buildReleaseNotes 는 v3.0.0, v3.0.1 과 같은 형식의 노트를 만든다', () => {
  const base = { prNumber: 105, tag: 'v3.0.2', prevTag: 'v3.0.1', repo: 'Wisesaturn/blog' };

  it('섹션, 작업 내용, Full Changelog 순서다', () => {
    const { notes, fallback } = buildReleaseNotes({
      ...base,
      title: 'fix: 이미지 보존',
      body: BODY,
    });

    expect(fallback).toBe(false);
    expect(notes).toBe(`## Fix

### 옛 파일 정리를 저장 뒤로 옮김 (#105)

- 발행이 실패해도 운영 이미지가 남습니다.

### 이미지가 아닌 응답을 막음 (#105)

- 404 면 원인이 보이는 에러를 냅니다.

**Full Changelog**: https://github.com/Wisesaturn/blog/compare/v3.0.1...v3.0.2
`);
  });

  it('작업 내용 절이 없으면 PR 제목 요약 한 줄로 대신하고 fallback 을 알린다', () => {
    const { notes, fallback } = buildReleaseNotes({
      ...base,
      title: 'style: 푸터 버전 표시',
      body: '',
    });

    expect(fallback).toBe(true);
    expect(notes).toContain('## Etc\n\n### 푸터 버전 표시 (#105)');
  });

  it('직전 태그가 없으면 Full Changelog 를 쓰지 않는다', () => {
    const { notes } = buildReleaseNotes({
      ...base,
      prevTag: undefined,
      title: 'fix: x',
      body: BODY,
    });
    expect(notes).not.toContain('Full Changelog');
  });
});
