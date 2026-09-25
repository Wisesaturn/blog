/**
 * `sortProjects` 는 프로젝트 카드를 시작일 내림차순으로 세운다.
 *
 * 시작일이 같을 때 종료일을 **오름차순**으로 본다. 시작일 정렬과 방향이 반대라 고치다가
 * 뒤집기 쉬운 자리다. 짧게 끝난 프로젝트가 위로 오는 것이 의도된 동작이다.
 */
import { describe, expect, it } from 'vitest';

import sortProjects from './sortProjects';
import { type IProject } from '../types/project';

type ProjectRow = Omit<IProject, 'body'>;

function project(title: string, start: string, end: string | null): ProjectRow {
  return { title, date: { start, end } } as unknown as ProjectRow;
}

describe('시작일이 늦은 프로젝트를 앞에 둔다', () => {
  it('시작일 내림차순으로 정렬한다', () => {
    const rows = [
      project('오래된 것', '2023-01-01', '2023-06-01'),
      project('최근 것', '2025-01-01', '2025-06-01'),
      project('중간 것', '2024-01-01', '2024-06-01'),
    ];

    expect(sortProjects(rows).map((p) => p.title)).toEqual(['최근 것', '중간 것', '오래된 것']);
  });
});

describe('시작일이 같으면 종료일이 이른 것을 앞에 둔다', () => {
  it('종료일 오름차순으로 정렬한다', () => {
    const rows = [
      project('길게 한 것', '2024-01-01', '2024-12-01'),
      project('짧게 끝난 것', '2024-01-01', '2024-03-01'),
    ];

    expect(sortProjects(rows).map((p) => p.title)).toEqual(['짧게 끝난 것', '길게 한 것']);
  });

  /**
   * 진행 중인 프로젝트는 Notion 에서 끝 날짜가 비어 null 로 저장된다. 예전 코드는 new Date(null) 로
   * 1970-01-01 이 되어 맨 앞에 왔다. 의도한 것인지 알 수 없지만 지금 화면이 이 순서라 그대로 고정한다.
   */
  it('종료일이 없는 프로젝트를 가장 이르게 끝난 것으로 보고 앞에 둔다', () => {
    const rows = [
      project('끝난 것', '2024-01-01', '2024-03-01'),
      project('진행 중', '2024-01-01', null),
    ];

    expect(sortProjects(rows).map((p) => p.title)).toEqual(['진행 중', '끝난 것']);
  });

  it('시작일과 종료일이 모두 같으면 순서를 보장하지 않는다', () => {
    const rows = [
      project('A', '2024-01-01', '2024-06-01'),
      project('B', '2024-01-01', '2024-06-01'),
    ];

    expect(
      sortProjects(rows)
        .map((p) => p.title)
        .sort(),
    ).toEqual(['A', 'B']);
  });
});

describe('빈 목록과 한 건', () => {
  it('빈 배열을 넣으면 빈 배열이다', () => {
    expect(sortProjects([])).toEqual([]);
  });

  it('한 건이면 그대로 둔다', () => {
    const rows = [project('하나', '2024-01-01', '2024-06-01')];

    expect(sortProjects(rows).map((p) => p.title)).toEqual(['하나']);
  });
});

describe('입력 배열을 제자리에서 바꾼다', () => {
  it('돌려준 배열이 넣은 배열과 같은 객체다', () => {
    const rows = [
      project('A', '2023-01-01', '2023-06-01'),
      project('B', '2025-01-01', '2025-06-01'),
    ];

    expect(sortProjects(rows)).toBe(rows);
    expect(rows.map((p) => p.title)).toEqual(['B', 'A']);
  });
});
