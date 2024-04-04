import { doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';

import { db } from '$shared/middleware/firebase';
import Logger from '$shared/helper/logger';

import { ISnippet } from '../types/snippet';

interface Props {
  category: string;
  title: string;
  data: Partial<ISnippet>;
}

export default async function updateSnippet(props: Props) {
  const { category, title, data } = props;
  try {
    const docRef = doc(db, category, title);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, data);
    } else {
      await setDoc(docRef, data);
    }
    Logger.success(`${category}/${title}에 스니펫을 업데이트하였습니다.`);
  } catch (err) {
    if (err instanceof Error) {
      Logger.error(new Error(`${category}/${title}에 해당하는 스니펫이 없습니다`));
      Logger.error(err);
    }
    throw err;
  }
}
