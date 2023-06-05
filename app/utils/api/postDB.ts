import { doc, setDoc } from 'firebase/firestore';

import { db } from '@utils/firebase.server';

import type { INotionPostReturn } from '@Types/post';

export default async function postDB(document: string, title: string, data: INotionPostReturn) {
  try {
    const docRef = doc(db, document, title);
    await setDoc(docRef, data);
  } catch (err) {
    throw new Error('게시물을 업로드하는데 실패하였습니다');
  }
}
