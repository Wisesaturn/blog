import { doc, updateDoc } from 'firebase/firestore';

import { db } from '@utils/firebase.server';

export default async function updateDB(document: string, title: string, data: any) {
  const docRef = doc(db, document, title!);
  try {
    const docSnap = await updateDoc(docRef, data);
    return docSnap;
  } catch (error: any) {
    throw new Error(`게시물 기능에 오류가 발생했습니다. ${error.message}`);
  }
}
