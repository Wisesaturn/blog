import { collection, query, where, getDocs } from 'firebase/firestore';

import { db } from '@utils/firebase';
import { CATEGORY_DATA } from '@utils/constant/category';

export default async function searchAllDB() {
  const allSearchData = await Promise.all(
    CATEGORY_DATA.map(async (cur) => {
      const q = query(collection(db, cur.link));

      const querySnapshot = await getDocs(q);
      const searchData = querySnapshot.docs.map((doc) => doc.data());

      return { searchData };
    }),
  );
  const combinedData = allSearchData.reduce((acc, cur) => {
    acc.searchData.push(...cur.searchData);
    return acc;
  });

  return combinedData;
}
