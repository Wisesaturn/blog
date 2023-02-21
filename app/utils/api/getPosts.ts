import { db } from '@utils/firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import type { postingTypes } from '@Types/post';

export default async function getPosts(document: string) {
  const q = query(collection(db, document));
  const querySnapshot = await getDocs(q);
  const data: postingTypes[] = [];

  querySnapshot.forEach((doc) => {
    const docData = doc.data() as postingTypes;
    data.push({ ...docData });
  });

  return data;
}
