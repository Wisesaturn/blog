import { doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';

import { db } from '@utils/firebase.server';
import UploadFailedError from '@utils/error/UploadFailedError';

import type { IFirebasePostReturn } from '@Types/post';

export default async function postDB(
  document: string,
  title: string,
  data: Partial<IFirebasePostReturn>,
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
    throw new UploadFailedError();
  }
}
