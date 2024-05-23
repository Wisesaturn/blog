import { doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';

import { db } from '$shared/middleware/firebase';
import Logger from '$shared/helper/logger';

import { IPost } from '../types/post';

interface Props {
  category: string;
  title: string;
  data: Partial<IPost>;
  isUpdatePost?: boolean;
}

export default async function updatePost(props: Props) {
  const { category, title, data, isUpdatePost = false } = props;
  try {
    const docRef = doc(db, category, title);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const updatedData = isUpdatePost
        ? { ...data, views: docSnap.data().views || data.views }
        : data;
      await updateDoc(docRef, updatedData);
    } else {
      await setDoc(docRef, data);
    }

    if (isUpdatePost) {
      Logger.success(`${category}/${title}에 게시물을 업데이트하였습니다.`);
    } else {
      Logger.log(`${title} views update : ${data.views}`);
    }
  } catch (err) {
    if (err instanceof Error) {
      const NotFoundError = new Error(`${category}/${title}에 해당하는 게시물이 없습니다`, {
        cause: err,
      });
      Logger.error(NotFoundError);
      throw NotFoundError;
    }
    throw err;
  }
}
