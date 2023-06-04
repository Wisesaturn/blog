import { collection, getCountFromServer } from 'firebase/firestore';

import { db } from '@utils/firebase';
import { CATEGORY_DATA } from '@utils/constant/category';

export default async function countDB() {
  const allCountData = await Promise.all(
    CATEGORY_DATA.map(async (cur) => {
      const coll = collection(db, cur.link);
      const snapshot = await getCountFromServer(coll);
      return snapshot.data().count;
    }),
  );

  const totalCount = allCountData.reduce((sum, count) => sum + count, 0);

  return totalCount;
}
