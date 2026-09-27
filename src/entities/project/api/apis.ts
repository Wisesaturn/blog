import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

import { db } from '@/commons/api/firebase.server';
import { parseDocument, parseDocuments } from '@/commons/lib/firestoreDocument';
import Logger from '@/commons/lib/logger';

import { PROJECTS_DATA } from '../config/projects';
import { projectBody, projectMeta } from '../model/projectDocument';
import { type IProject } from './types';

interface GetProjectProps {
  title: string;
}

export async function getProject(props: GetProjectProps) {
  const { title } = props;
  const metaQ = query(collection(db, 'projects', title, 'meta'));
  const bodyQ = query(collection(db, 'projects', title, 'body'));
  const queryMetaSnapshot = await getDocs(metaQ);
  const queryBodySnapshot = await getDocs(bodyQ);

  if (queryMetaSnapshot.empty || queryBodySnapshot.empty) {
    const NotFoundError = new Error(`${title}에 해당하는 프로젝트가 없습니다`);
    Logger.error(NotFoundError);
    throw NotFoundError;
  }

  return {
    ...parseDocument({ schema: projectMeta, doc: queryMetaSnapshot.docs[0] }),
    ...parseDocument({ schema: projectBody, doc: queryBodySnapshot.docs[0] }),
  };
}

export async function getProjects() {
  const perProject = await Promise.all(
    PROJECTS_DATA.map(async (project) => {
      const querySnapshot = await getDocs(query(collection(db, 'projects', project.name, 'meta')));
      return parseDocuments({ schema: projectMeta, docs: querySnapshot.docs });
    }),
  );

  return perProject.flat();
}

interface UpdateProjectProps {
  title: string;
  meta: Partial<Omit<IProject, 'body'>>;
  body?: string;
  isUpdateProject?: boolean;
}

export async function updateProject(props: UpdateProjectProps) {
  const { title, meta, body, isUpdateProject = false } = props;
  try {
    const docMetaRef = doc(collection(db, 'projects', title, 'meta'), meta.index);
    const docMetaSnap = await getDoc(docMetaRef);

    if (docMetaSnap.exists()) {
      // 조회수와 좋아요는 stats 문서에 있다 (#117). 메타 문서만 덮어쓴다
      await updateDoc(docMetaRef, meta);
    } else {
      await setDoc(docMetaRef, meta);
    }

    if (body) {
      const docBodyRef = doc(collection(db, 'projects', title, 'body'), meta.index);
      const docBodySnap = await getDoc(docBodyRef);

      if (docBodySnap.exists()) {
        await updateDoc(docBodyRef, { body });
      } else {
        await setDoc(docBodyRef, { body });
      }
    }

    if (isUpdateProject) Logger.success(`${title}에 프로젝트를 업데이트하였습니다.`);
  } catch (err) {
    if (err instanceof Error) {
      const NotFoundError = new Error(`${title}에 해당하는 프로젝트가 없습니다`, { cause: err });
      Logger.error(NotFoundError);
      throw NotFoundError;
    }
    throw err;
  }
}
