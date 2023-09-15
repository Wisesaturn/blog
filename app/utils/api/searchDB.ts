import { collection, query, getDocs } from 'firebase/firestore';

import { db } from '@utils/firebase.server';

import type { DocumentData } from 'firebase/firestore';
import type { IPost } from '@Types/post';

export default async function searchDB(category: string) {
  const q = query(collection(db, category));

  const querySnapshot = await getDocs(q);
  const categoryData = querySnapshot.docs.map((doc) => doc.data());

  categoryData.sort((a: DocumentData, b: DocumentData) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateA < dateB ? 1 : -1;
  });

  return categoryData as IPost[];
}
