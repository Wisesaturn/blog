import { doc, getDoc } from 'firebase/firestore';

import { IFirebasePostReturn } from '@Types/post';

import { db } from '@utils/firebase.server';
import NotFoundPostError from '@utils/error/NotFoundPostError';

export default async function fetchDB(document: string, title: string) {
  const docRef = doc(db, document, title!);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) throw new NotFoundPostError();

  return docSnap.data() as IFirebasePostReturn;
}
