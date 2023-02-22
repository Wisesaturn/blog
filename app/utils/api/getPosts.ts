import { db } from '@utils/firebase';
import { collection, onSnapshot, query, getDocs } from 'firebase/firestore';
import type { postingTypes } from '@Types/post';

export default async function getPosts(document: string) {
  const q = query(collection(db, document));
  const querySnapshot = await getDocs(q);
  const data: Partial<postingTypes>[] = [];

  querySnapshot.forEach((doc) => {
    const { comments, body, ...docData } = doc.data() as postingTypes;
    const parsingDate = doc.data().createdAt.toDate();
    const parsingDescription = doc
      .data()
      .body.replace(/<pre(.*?)<\/pre>|<code(.*?)<\/code>/g, '[Code]')
      .replace(/(<([^>]+)>)/gi, '');

    data.push({ ...docData, createdAt: parsingDate, description: parsingDescription });
  });

  if (!querySnapshot) {
    onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const { comments, body, ...docData } = change.doc.data() as postingTypes;
        const parsingDate = change.doc.data().createdAt.toDate();
        const parsingDescription = change.doc
          .data()
          .body.replace(/<pre(.*?)<\/pre>|<code(.*?)<\/code>/g, '[Code]')
          .replace(/(<([^>]+)>)/gi, '');

        data.push({ ...docData, createdAt: parsingDate, description: parsingDescription });
      });
    });
  }

  return data;
}
