import { collection, query, getDocs } from 'firebase/firestore';

import { PROJECTS_DATA } from '@/shared/constant/category';

import { db } from '@/commons/api/firebase';
import { parseDocuments } from '@/commons/lib/firestoreDocument';

import { projectMeta } from '../model/projectDocument';

export default async function getProjects() {
  const perProject = await Promise.all(
    PROJECTS_DATA.map(async (project) => {
      const querySnapshot = await getDocs(query(collection(db, 'projects', project.name, 'meta')));
      return parseDocuments(projectMeta, querySnapshot.docs);
    }),
  );

  return perProject.flat();
}
