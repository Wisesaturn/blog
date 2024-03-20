import { doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';

import { db } from '$shared/middleware/firebase';

import { IPost } from '../types/post';

interface UpdatePostProps {
  category: string;
  title: string;
  data: Partial<IPost>;
}

export default async function updatePost(props: UpdatePostProps) {
  const { category, title, data } = props;
  try {
    const docRef = doc(db, category, title);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, data);
    } else {
      await setDoc(docRef, data);
    }
  } catch (err) {
    throw new Error();
  }
}
