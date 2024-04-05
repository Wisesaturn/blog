import { doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';

import { db } from '$shared/middleware/firebase';
import Logger from '$shared/helper/logger';

import { IPost } from '../types/post';

interface Props {
  category: string;
  title: string;
  data: Partial<IPost>;
}

export default async function updatePost(props: Props) {
  const { category, title, data } = props;
  try {
    const docRef = doc(db, category, title);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, data);
    } else {
      await setDoc(docRef, data);
    }
    Logger.success(`${category}/${title}에 게시물을 업데이트하였습니다.`);
  } catch (err) {
    if (err instanceof Error) {
      Logger.error(new Error(`${category}/${title}에 해당하는 게시물이 없습니다`, { cause: err }));
    }
    throw err;
  }
}
