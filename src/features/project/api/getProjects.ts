import { collection, query, getDocs } from 'firebase/firestore';

import { db } from '$shared/middleware/firebase';
import { PROJECTS_DATA } from '$shared/constant/category';

import { IProject } from '../types/project';

export default async function getProjects() {
  const originProjects = await Promise.all(
    PROJECTS_DATA.map(async (project) => {
      const q = query(collection(db, 'projects', project.name, 'meta'));
      const querySnapshot = await getDocs(q);
      const projects = querySnapshot.docs.map((doc) => doc.data());
      return { data: projects };
    }),
  );

  const projects = originProjects.reduce((acc, cur) => {
    acc.data.push(...cur.data);

    return acc;
  });

  return projects.data as Omit<IProject, 'body'>[];
}
