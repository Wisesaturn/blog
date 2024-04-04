import { doc, getDoc } from 'firebase/firestore';

import { db } from '$shared/middleware/firebase';
import convertString from '$shared/lib/convertString';
import Logger from '$shared/helper/logger';

import { ISnippet } from '../types/snippet';

interface Props {
  title: string;
}

export default async function getSnippet(props: Props) {
  const { title } = props;
  const convertTitle = convertString(title, 'spaceToDash');
  const docRef = doc(db, 'snippets', convertTitle);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    Logger.error(new Error(`${title}에 해당하는 스니펫이 없습니다`));
  }

  return docSnap.data() as ISnippet;
}
