import { doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';

import { db } from '$shared/middleware/firebase';
import Logger from '$shared/helper/logger';

import { IProject } from '../types/project';

interface UpdateProjectProps {
  category: string;
  title: string;
  data: Partial<IProject>;
}

export default async function updateProject(props: UpdateProjectProps) {
  const { category, title, data } = props;
  try {
    const docRef = doc(db, category, title);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, data);
    } else {
      await setDoc(docRef, data);
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
