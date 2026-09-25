import { doc, getDoc } from 'firebase/firestore';

import Logger from '@/shared/helper/logger';
import { db } from '@/shared/middleware/firebase';
import { parseDocument } from '@/shared/model/firestoreDocument';

import { postDocument } from '../model/postDocument';

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

  return parseDocument(postDocument, docSnap);
}
