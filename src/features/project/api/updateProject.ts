import { doc, updateDoc, setDoc, getDoc, collection } from 'firebase/firestore';

import { db } from '$shared/middleware/firebase';
import Logger from '$shared/helper/logger';

import { IProject } from '../types/project';

interface Props {
  title: string;
  meta: Partial<Omit<IProject, 'body'>>;
  body?: string;
  isUpdateProject?: boolean;
}

export default async function updateProject(props: Props) {
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

    Logger.success(`${title}에 프로젝트를 업데이트하였습니다.`);
  } catch (err) {
    if (err instanceof Error) {
      const NotFoundError = new Error(`${title}에 해당하는 프로젝트가 없습니다`, { cause: err });
      Logger.error(NotFoundError);
      throw NotFoundError;
    }
    throw err;
  }
}
