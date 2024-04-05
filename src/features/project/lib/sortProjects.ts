import { DocumentData } from 'firebase/firestore';

import { IProject } from '../types/project';

/**
 * @summary 프로젝트 카드를 정렬하는 함수
 * @param projects
 * @returns
 */
export default function sortProjects(projects: Omit<IProject, 'body'>[]) {
  projects.sort((a: DocumentData, b: DocumentData) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateA < dateB ? 1 : -1;
  });

  return projects;
}
