import { doc, getDoc } from 'firebase/firestore';

import { db } from '@/shared/middleware/firebase';
import Logger from '@/shared/helper/logger';
import { parseDocument } from '@/shared/model/firestoreDocument';

import { snippetDocument } from '../model/snippetDocument';

interface Props {
  title: string;
}

export default async function getSnippet(props: Props) {
  const { title } = props;
  const docRef = doc(db, 'snippets', title);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    const NotFoundError = new Error(`${title}에 해당하는 스니펫이 없습니다`);
    Logger.error(NotFoundError);
    throw NotFoundError;
  }

  return parseDocument(snippetDocument, docSnap);
}
