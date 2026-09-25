import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
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
    ...parseDocument(projectMeta, queryMetaSnapshot.docs[0]),
    ...parseDocument(projectBody, queryBodySnapshot.docs[0]),
  };
}

export async function getProjects() {
  const perProject = await Promise.all(
    PROJECTS_DATA.map(async (project) => {
      const querySnapshot = await getDocs(query(collection(db, 'projects', project.name, 'meta')));
      return parseDocuments(projectMeta, querySnapshot.docs);
    }),
  );

  return perProject.flat();
}

interface IncreaseProjectViewsProps {
  title: string;
}

/**
 * @description 프로젝트 조회수를 1 올리고, 올린 뒤의 값을 돌려준다
 *
 * 프로젝트는 `projects/{title}/meta/{index}` 에 조회수가 있다. `index` 를 모르므로 `meta` 의
 * 첫 문서를 찾아 올린다. `getProject` 도 같은 문서를 읽는다.
 *
 * 동시 요청에서 조회수가 빠지지 않도록 `increment()` 로 올린다.
 * @param props.title 프로젝트 이름. URL 의 제목 그대로다
 * @returns 올린 뒤의 조회수
 * @throws `meta` 문서가 없으면 에러가 발생한다
 */
export async function increaseProjectViews({ title }: IncreaseProjectViewsProps): Promise<number> {
  const metaSnap = await getDocs(query(collection(db, 'projects', title, 'meta'), limit(1)));
  if (metaSnap.empty) throw new Error(`${title}에 해당하는 프로젝트가 없습니다`);

  const docRef = metaSnap.docs[0].ref;
  await updateDoc(docRef, { views: increment(1) });
  const snap = await getDoc(docRef);
  return snap.data()?.views ?? 0;
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
      const updatedMeta = isUpdateProject
        ? { ...meta, views: docMetaSnap.data().views || meta.views }
        : meta;
      await updateDoc(docMetaRef, updatedMeta);
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

    if (isUpdateProject) {
      Logger.success(`${title}에 프로젝트를 업데이트하였습니다.`);
    } else {
      Logger.log(`${title} views update : ${meta.views}`);
    }
  } catch (err) {
    if (err instanceof Error) {
      const NotFoundError = new Error(`${title}에 해당하는 프로젝트가 없습니다`, { cause: err });
      Logger.error(NotFoundError);
      throw NotFoundError;
    }
    throw err;
  }
}
