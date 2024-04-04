import { collection, query, getDocs, where } from 'firebase/firestore';

import { db } from '$shared/middleware/firebase';

import { ISnippet } from '../types/snippet';

interface Props {
  keyword: string;
}

export default async function getSnippets(props: Props) {
  const { keyword } = props;

  const q = keyword
    ? query(
        collection(db, 'snippets'),
        where('plainTitle', '>=', keyword),
        where('plainTitle', '<=', `${keyword}\uf8ff`),
      )
    : query(collection(db, 'snippets'));

  const querySnapshot = await getDocs(q);
  const snippets = querySnapshot.docs.map((doc) => doc.data());

  return snippets as ISnippet[];
}
