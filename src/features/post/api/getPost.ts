import { doc, getDoc } from 'firebase/firestore';

import { db } from '$shared/middleware/firebase';
import Logger from '$shared/helper/logger';

import { IPost } from '../types/post';

interface Props {
  category: string;
  title: string;
}

export default async function getPost(props: Props) {
  const { category, title } = props;
  const docRef = doc(db, category, title);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    const NotFoundError = new Error(`${category}/${title}에 해당하는 게시물이 없습니다`);
    Logger.error(NotFoundError);
    throw NotFoundError;
  }

  return docSnap.data() as IPost;
}
