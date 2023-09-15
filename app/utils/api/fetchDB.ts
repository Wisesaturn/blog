import { doc, getDoc } from 'firebase/firestore';

import { IFirebasePostReturn } from '@Types/post';

import { db } from '@utils/firebase.server';

export default async function fetchDB(document: string, title: string) {
  const docRef = doc(db, document, title!);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) throw new Error('게시물을 찾을 수 없습니다');

  return docSnap.data() as IFirebasePostReturn;
}
