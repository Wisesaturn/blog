import { doc, getDoc } from 'firebase/firestore';

import { db } from '$shared/middleware/firebase';
import convertString from '$shared/lib/convertString';

import { IPost } from '../types/post';

interface GetPostProps {
  category: string;
  title: string;
}

export default async function getPost(props: GetPostProps) {
  const { category, title } = props;
  const convertTitle = convertString(title, 'spaceToDash');
  const docRef = doc(db, category, convertTitle);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) throw new Error();

  return docSnap.data() as IPost;
}
