import { doc, updateDoc } from 'firebase/firestore';

import { db } from '@utils/firebase.server';

import type { INotionPostReturn } from '@Types/post';

export default async function postDB(
  document: string,
  title: string,
  data: Partial<INotionPostReturn>,
) {
  try {
    const docRef = doc(db, document, title);
    await updateDoc(docRef, data);
  } catch (err) {
    throw new Error('게시물을 업로드하는데 실패하였습니다');
  }
}
