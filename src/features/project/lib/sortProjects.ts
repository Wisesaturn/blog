import { IProject } from '../types/project';

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
      const dateAEnd = new Date(a.date.end);
      const dateBEnd = new Date(b.date.end);
      return dateAEnd < dateBEnd ? -1 : 1;
    }
    return dateAStart < dateBStart ? 1 : -1;
  });

  return projects;
}
