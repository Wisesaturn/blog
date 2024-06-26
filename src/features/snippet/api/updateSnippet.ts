import { doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';

import { db } from '$shared/middleware/firebase';
import Logger from '$shared/helper/logger';

import { ISnippet } from '../types/snippet';

interface Props {
  title: string;
  data: Partial<ISnippet>;
  isUpdateSnippet?: boolean;
}

export default async function updateSnippet(props: Props) {
  const { title, data, isUpdateSnippet = false } = props;
  try {
    const docRef = doc(db, 'snippets', title);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const updatedData = isUpdateSnippet
        ? { ...data, views: docSnap.data().views || data.views }
        : data;
      await updateDoc(docRef, updatedData);
    } else {
      await setDoc(docRef, data);
    }

    if (isUpdateSnippet) {
      Logger.success(`${title}에 스니펫을 업데이트하였습니다.`);
    } else {
      Logger.log(`${title} views update : ${data.views}`);
    }
  } catch (err) {
    if (err instanceof Error) {
      const NotFoundError = new Error(`${title}에 해당하는 스니펫이 없습니다`, {
        cause: err,
      });
      Logger.error(NotFoundError);
      throw NotFoundError;
    }
  }
}
