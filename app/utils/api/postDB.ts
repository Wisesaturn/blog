import { doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';

import { db } from '@utils/firebase.server';

import type { INotionPostReturn } from '@Types/post';

export default async function postDB(
  document: string,
  title: string,
  data: Partial<INotionPostReturn>,
) {
  try {
    const docRef = doc(db, document, title);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, data);
    } else {
      await setDoc(docRef, data);
    }
  } catch (err: any) {
    throw new Error(`게시물을 업로드하는데 실패하였습니다 ${err.message}`);
  }
}
