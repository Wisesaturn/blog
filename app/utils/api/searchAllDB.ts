import { collection, query, getDocs } from 'firebase/firestore';

import { db } from '@utils/firebase';
import { CATEGORY_DATA } from '@utils/constant/category';

import countDB from './countDB';

import type { DocumentData } from 'firebase/firestore';
import type { IPost } from '@Types/post';

export default async function searchAllDB(size?: number) {
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

  combinedData.searchData.sort((a: DocumentData, b: DocumentData) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateA < dateB ? 1 : -1;
  });

  const slicedData = combinedData.searchData.slice(0, size || (await countDB()));

  return slicedData;
}
