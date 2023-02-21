import { db } from '@utils/firebase';
import { where, collection, query, getDocs } from 'firebase/firestore';
import type { postingTypes } from '@Types/post';

export default async function getPost(document: string, id: string) {
  const q = query(collection(db, document), where('title', '==', id.replace(/-/g, ' ')));
  const querySnapshot = await getDocs(q);
  const data: postingTypes[] = [];

  querySnapshot.forEach((doc) => {
    const docData = doc.data() as postingTypes;
    data.push({ ...docData });
  });

  return data;
}
