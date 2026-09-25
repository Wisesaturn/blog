import { IProject } from '../api/types';

/**
 * @summary 프로젝트 카드를 정렬하는 함수
 * @param projects
 * @returns
 */
export default function sortProjects(projects: Omit<IProject, 'body'>[]) {
  projects.sort((a, b) => {
    const dateAStart = new Date(a.date.start);
    const dateBStart = new Date(b.date.start);
    if (dateAStart.getTime() === dateBStart.getTime()) {
      // 끝 날짜가 없는 진행 중 프로젝트는 예전부터 new Date(null), 곧 1970-01-01 로 비교해 왔다
      const dateAEnd = new Date(a.date.end ?? 0);
      const dateBEnd = new Date(b.date.end ?? 0);
      return dateAEnd < dateBEnd ? -1 : 1;
    }
    return dateAStart < dateBStart ? 1 : -1;
  });

  return projects;
}
