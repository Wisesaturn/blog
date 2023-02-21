import { db } from '@utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { postingTypes } from '@Types/post';

export default async function getPost(document: string, id: string) {
  const docRef = doc(db, document, id.replace(/-/g, ' '));
  const docSnap = await getDoc(docRef);

  return docSnap.data() as postingTypes;
}
