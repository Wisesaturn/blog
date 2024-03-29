import { doc, updateDoc, setDoc, getDoc, collection } from 'firebase/firestore';

import { db } from '$shared/middleware/firebase';
import Logger from '$shared/helper/logger';

import { IProject } from '../types/project';

interface Props {
  category: string;
  title: string;
  data: Partial<IProject>;
}

export default async function updateProject(props: Props) {
  const { category, title, data } = props;
  try {
    const { body, ...meta } = data;
    const docMetaRef = doc(collection(db, category, title, 'meta'), data.index);
    const docBodyRef = doc(collection(db, category, title, 'body'), data.index);
    const docMetaSnap = await getDoc(docMetaRef);
    const docBodySnap = await getDoc(docBodyRef);

    if (docMetaSnap.exists()) {
      await updateDoc(docMetaRef, meta);
    } else {
      await setDoc(docMetaRef, meta);
    }

    if (docBodySnap.exists()) {
      await updateDoc(docBodyRef, { body });
    } else {
      await setDoc(docBodyRef, { body });
    }

    Logger.success(`${category}/${title}에 프로젝트를 업데이트하였습니다.`);
  } catch (err) {
    if (err instanceof Error) {
      Logger.error(new Error(`${category}/${title}에 해당하는 프로젝트가 없습니다`));
      Logger.error(err);
    }
    throw err;
  }
}
